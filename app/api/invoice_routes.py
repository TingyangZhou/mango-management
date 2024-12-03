from flask import Blueprint, request, make_response, jsonify
from flask_login import login_required, current_user
# from app.api.aws import get_unique_filename, upload_file_to_s3
from app.models import User, Property, Lease, Tenant, Invoice, db
from app.forms import CreateInvoiceForm, UpdateInvoiceForm
from datetime import datetime, date
from sqlalchemy.exc import IntegrityError

from sqlalchemy.orm import joinedload

invoice_routes = Blueprint("invoice", __name__, url_prefix="/api/invoices")


# Get all invoices
from flask import jsonify
from flask_login import login_required, current_user
from datetime import datetime
from sqlalchemy import and_, or_

@invoice_routes.route("/all", methods=['GET'])
@login_required
def get_all_invoices():
    
    invoices = (
        Invoice.query
        .options(
            joinedload(Invoice.lease).joinedload(Lease.property)
        )
        .filter(Invoice.user_id == current_user.id)
        .all()
    )
    
    # Construct response to dict
    invoices_dict = [
        {
            "id": invoice.id,
            "item": invoice.item,
            "amount": invoice.amount,
            "created_at": invoice.created_at,
            "due_date": invoice.due_date,
            "payment_date": invoice.payment_date,
            "property": {
                "id": invoice.lease.property.id,
                "address": invoice.lease.property.address
            } if invoice.lease and invoice.lease.property else None,
            "status": (
                "paid" if invoice.payment_date else
                "overdue" if invoice.due_date < datetime.now().date() else
                "outstanding"
            )
        }
        for invoice in invoices
    ]

    return jsonify({"invoices": invoices_dict}), 200


# # Get all invoices with pagination
# @invoice_routes.route("", methods=['GET'])
# @login_required
# def get_all_invoices_page():
#     page = request.args.get('page', 1, type=int)  # Default to page 1
#     per_page = request.args.get('per_page', 10, type=int)  # Default to 10 items per page

#     # Get total number of invoices
#     num_invoices = Invoice.query.filter(Invoice.user_id == current_user.id).count()

#     # Paginate invoices
#     paginated_invoices = (
#         Invoice.query
#         .options(
#             joinedload(Invoice.lease).joinedload(Lease.property)
#         )
#         .filter(Invoice.user_id == current_user.id)
#         .order_by(Invoice.created_at.desc())
#         .paginate(page=page, per_page=per_page, error_out=False)
#     )

#     # Construct response
#     invoices_dict = [
#         {
#             "id": invoice.id,
#             "item": invoice.item,
#             "amount": invoice.amount,
#             "created_at": invoice.created_at,
#             "due_date": invoice.due_date,
#             "payment_date": invoice.payment_date,
#             "property": {
#                 "id": invoice.lease.property.id,
#                 "address": invoice.lease.property.address
#             } if invoice.lease and invoice.lease.property else None,
#             "status": (
#                 "paid" if invoice.payment_date else
#                 "overdue" if invoice.due_date and invoice.due_date < datetime.now().date() else
#                 "outstanding"
#             )
#         }
#         for invoice in paginated_invoices.items
#     ]

#     return jsonify({"invoices": invoices_dict, "num_invoices": num_invoices}), 200


# Get filtered invoices with pagination 
@invoice_routes.route("", methods=['GET'])
@login_required
def get_all_invoices_filter():
     # Extract query parameters
    filter_by = request.args.get('filterBy', default=None)
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)

    # Parse `filter_by` into a list of filters
    filters = []

    if filter_by:
        filters = filter_by.lower().strip('"').strip("'").split(",")
    


    # Base query
    invoices_query = Invoice.query.filter(Invoice.user_id == current_user.id)

    # Define filter conditions
    conditions = []

    # Add conditions for each filter
    if "paid" in filters:
        conditions.append(Invoice.payment_date.isnot(None))
    if "outstanding" in filters:
        conditions.append(
            and_(
                Invoice.due_date.isnot(None),
                Invoice.due_date > datetime.now().date(),
                Invoice.payment_date.is_(None)
            )
        )
    if "overdue" in filters:
        conditions.append(
            and_(
                Invoice.due_date.isnot(None),
                Invoice.due_date < datetime.now().date(),
                Invoice.payment_date.is_(None)
            )
        )

    # Apply combined conditions to the query
    if conditions:
        invoices_query = invoices_query.filter(or_(*conditions))
        num_invoices = invoices_query.filter(or_(*conditions)).count()
    else:
        num_invoices = invoices_query.count()

    # Pagination and ordering
    paginated_invoices = invoices_query.order_by(Invoice.created_at.desc()).paginate(
        page=page, per_page=per_page, error_out=False
    )

    
    # Construct response
    invoices_dict = [
        {
            "id": invoice.id,
            "item": invoice.item,
            "amount": invoice.amount,
            "created_at": invoice.created_at,
            "due_date": invoice.due_date,
            "payment_date": invoice.payment_date,
            "property": {
                "id": invoice.lease.property.id,
                "address": invoice.lease.property.address
            } if invoice.lease and invoice.lease.property else None,
            "status": (
                "paid" if invoice.payment_date else
                "overdue" if invoice.due_date and invoice.due_date < datetime.now().date() else
                "outstanding"
            )
        }
        for invoice in paginated_invoices.items
    ]

    return jsonify({"invoices": invoices_dict, "num_invoices": num_invoices}), 200

# Get Invoice details from an id
@invoice_routes.route("/<int:invoiceId>", methods=['GET'])
@login_required
def get_a_property(invoiceId):

    invoice = (
                Invoice.query
                .options(
                    joinedload(Invoice.lease).joinedload(Lease.property),
                    joinedload(Invoice.lease).joinedload(Lease.tenants)
                )
                .filter(Invoice.id == invoiceId)
               .first()
               )
    
    if (invoice == None):
          return jsonify({ "message": "Invoice couldn't be found"}), 404
    
    # Check if the user is authorized to access the invoice
    if invoice.user_id != current_user.id:
        return jsonify({"message": "You are not authorized to access this invoice"}), 403
    
    tenants = invoice.lease.tenants if invoice.lease else []

    invoice_dict = {
        "id": invoice.id,
        "item": invoice.item,
        "description": invoice.description,
        "amount": invoice.amount,
        "created_at": invoice.created_at,
        "due_date": invoice.due_date,
        "payment_date": invoice.payment_date,
        "property": {
            "id": invoice.lease.property.id,
            "address": invoice.lease.property.address
        } if invoice.lease and invoice.lease.property else None,
        "status": (
            "paid" if invoice.payment_date else
            "overdue" if invoice.due_date < datetime.now().date() else
            "outstanding"
        ), 
        "lease":{
             "id": invoice.lease.id,
             "start_date": invoice.lease.start_date,
             "end_date": invoice.lease.end_date
        } if invoice.lease else None,
        "tenants":[
            {
                "id": tenant.id,
                "first_name": tenant.first_name,
                "last_name": tenant.last_name
            }
            for tenant in tenants
        ],
    }


    return jsonify(invoice_dict), 200
    
    
# Search Invoices
@search_routes.route('/search', methods=['GET'])
@login_required
def search_invoices():
    search_query = request.args.get('input', '').strip()

    if not search_query:
        return jsonify({"message": "Search input required"}), 400
    

    search_results = Invoice.query.filter(db.and_(
        Invoice.user_id == current_user.id,
            or_(
                Invoice.item.ilike(f'%{search_query}%') |
                Invoice.property.address.ilike(f'%{search_query}%')
            )
        )
        
    ).all()

    # Construct response
    invoices_dict = [
        {
            "id": invoice.id,
            "item": invoice.item,
            "amount": invoice.amount,
            "created_at": invoice.created_at,
            "due_date": invoice.due_date,
            "payment_date": invoice.payment_date,
            "property": {
                "id": invoice.lease.property.id,
                "address": invoice.lease.property.address
            } if invoice.lease and invoice.lease.property else None,
            "status": (
                "paid" if invoice.payment_date else
                "overdue" if invoice.due_date and invoice.due_date < datetime.now().date() else
                "outstanding"
            )
        }
        for invoice in search_results
    ]
    return jsonify({'invoices': invoices_dict}), 200


# Create A Invoice
@invoice_routes.route("", methods=['POST'])
@login_required
def add_invoice():
    form = CreateInvoiceForm()
    form['csrf_token'].data = request.cookies.get('csrf_token')
 
    propertyId = form.property_id.data

    # Check if the property exists
    property = Property.query.get(propertyId)
    if not property:
        return jsonify({"message": "Property couldn't be found"}), 404
    
    # Check if the user is autherized to access this property
    if property.user_id != current_user.id:
        return jsonify({"message": "You are not authorized to access this property"}), 403
    
    # check if an active lease exists for this property

    lease = Lease.query.filter(
        Lease.property_id == propertyId,
        Lease.is_active == True).first()

    if not lease:
        return jsonify({"message": "Lease is not found"}), 400

    tenants = lease.tenants if lease else []

    if form.validate_on_submit():
        invoice = Invoice(
            user_id = current_user.id,
            lease_id = lease.id,
            amount = form.amount.data,
            due_date = form.due_date.data,
            item = form.item.data,
            description = form.description.data,
            ) 
        db.session.add(invoice)
        db.session.commit()

        invoice = (
            Invoice.query
            .options(
                joinedload(Invoice.lease).joinedload(Lease.property)   
            ).get(invoice.id)
        )

        res =  {
            "id": invoice.id,
            "item": invoice.item,
            "amount": invoice.amount,
            "created_at": invoice.created_at,
            "due_date": invoice.due_date,
            "payment_date": invoice.payment_date,
            "description": invoice.description,
            "property": {
                "id": invoice.lease.property.id,
                "address": invoice.lease.property.address
            } if invoice.lease and invoice.lease.property else None,
            "status": (
                "paid" if invoice.payment_date else
                "overdue" if invoice.due_date < datetime.now().date() else
                "outstanding"
            ),
            "lease":{
             "id": lease.id,
             "start_date": lease.start_date,
             "end_date": lease.end_date
            } if lease else None,
            "tenants":[
            {
                "id": tenant.id,
                "first_name": tenant.first_name,
                "last_name": tenant.last_name
            }
            for tenant in tenants
        ]

        }
       

        return jsonify(res), 201
   
    return form.errors, 400



# Update A Invoice
@invoice_routes.route("/<int:invoiceId>", methods=['PATCH'])
@login_required
def update_invoice(invoiceId):
      
    #Check if the invoice exists
    invoice = Invoice.query.get(invoiceId)
    if not invoice:
        return jsonify({"message": "Invoice couldn't be found"}), 404
     
    # Check if the user is authorized to access this invoice
    if invoice.user_id != current_user.id:
        return jsonify({"message": "You are not authorized to access this invoice"}), 403
    
    tenants = invoice.lease.tenants if invoice.lease else []
        
    form = UpdateInvoiceForm()
    form['csrf_token'].data = request.cookies.get('csrf_token')

    lease = Lease.query.get(invoice.lease_id)  
    if not lease or not lease.is_active: 
        return jsonify({"message": "Lease is not found or inactive"}), 400

    if form.validate_on_submit():
                
        invoice.item = form.item.data
        invoice.description = form.description.data
        invoice.amount = form.amount.data
        invoice.due_date = form.due_date.data
       

        db.session.commit()
        
        invoice = (
            Invoice.query
            .options(
                joinedload(Invoice.lease).joinedload(Lease.property)   
            ).get(invoice.id)
        )

        res =  {
            "id": invoice.id,
            "item": invoice.item,
            "amount": invoice.amount,
            "created_at": invoice.created_at,
            "due_date": invoice.due_date,
            "payment_date": invoice.payment_date,
            "description": invoice.description,
            "property": {
                "id": invoice.lease.property.id,
                "address": invoice.lease.property.address
            } if invoice.lease and invoice.lease.property else None,
            "status": (
                "paid" if invoice.payment_date else
                "overdue" if invoice.due_date < datetime.now().date() else
                "outstanding"
            ), 
            "lease":{
                "id": lease.id,
                "start_date": lease.start_date,
                "end_date": lease.end_date
            } if lease else None,
            "tenants":[
            {
                "id": tenant.id,
                "first_name": tenant.first_name,
                "last_name": tenant.last_name
            }
            for tenant in tenants
        ]
        }
       

        return jsonify(res), 200
    
   
    return form.errors, 400


# Pay an Invoice
@invoice_routes.route("/<int:invoiceId>/pay", methods=['PATCH'])
@login_required
def pay_invoice(invoiceId):
    # Check if the invoice exists
    invoice = Invoice.query.get(invoiceId)
    if not invoice:
        return jsonify({"message": "Invoice couldn't be found"}), 404
    
    # Check if the user is authorized to access this invoice
    if invoice.user_id != current_user.id:
        return jsonify({"message": "You are not authorized to access this invoice"}), 403

    # Handle payment date input
    data = request.get_json()
    try:
        payment_date = datetime.strptime(data.get("payment_date"), "%Y-%m-%d").date()
        
        if not payment_date:
            return jsonify({"message": "Payment date is required"}), 400
        
        if payment_date > date.today():
            return jsonify({"message": "Payment date cannot be in the future"}), 400
        invoice.payment_date = payment_date

        db.session.commit()
    except ValueError:
        return jsonify({"message": "Invalid payment_date format, expected YYYY-MM-DD"}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Failed to pay the invoice"}), 500

    # Prepare tenants data
    tenants = invoice.lease.tenants if invoice.lease else []

    # Prepare the response
    res = {
        "id": invoice.id,
        "item": invoice.item,
        "amount": invoice.amount,
        "description": invoice.description,
        "created_at": invoice.created_at,
        "due_date": invoice.due_date,
        "payment_date": invoice.payment_date,
        "property": {
            "id": invoice.lease.property.id,
            "address": invoice.lease.property.address
        } if invoice.lease and invoice.lease.property else None,
        "status": (
            "paid" if invoice.payment_date else
            "overdue" if invoice.due_date < datetime.now().date() else
            "unpaid"
        ),
        "tenants": [
            {
                "id": tenant.id,
                "first_name": tenant.first_name,
                "last_name": tenant.last_name
            }
            for tenant in tenants
        ]
    }

    return jsonify(res), 200



# Delete an invoice
@invoice_routes.route("/<int:invoiceId>", methods=['DELETE'])
@login_required
def remove_invoice(invoiceId):
     
    #Check if the invoice exists
    invoice = Invoice.query.get(invoiceId)
    if not invoice:
        return jsonify({"message": "Invoice couldn't be found"}), 404
     
    # Check if the user is authorized to access this property
    if invoice.user_id != current_user.id:
        return jsonify({"message": "You are not authorized to access this invoice"}), 403
    
    db.session.delete(invoice)
    db.session.commit()

    return jsonify(	{"message": "Successfully deleted"}), 200

