import os
import uuid

import boto3
import botocore

from dotenv import load_dotenv
load_dotenv()  

BUCKET_NAME = os.environ.get("S3_BUCKET")

S3_LOCATION = f"http://{BUCKET_NAME}.s3.amazonaws.com/"

s3 = boto3.client(
    "s3",
    aws_access_key_id=os.environ.get("S3_KEY"),
    aws_secret_access_key=os.environ.get("S3_SECRET"),
)


ALLOWED_EXTENSIONS = ["pdf", "png", "jpg", "jpeg", "gif", "doc", "docx"]


def get_unique_filename(filename):
    """
    Create a unique file name so duplicate files don't overwrite each other
    """
    ext = filename.rsplit(".", 1)[1].lower()
    unique_filename = uuid.uuid4().hex
    return f"{unique_filename}.{ext}"


def upload_file_to_s3(file, acl="public-read"):
    """
    Uploads a file to AWS. \n
    When you call the upload_file_to_s3 helper function from your route, make
    sure to print the variable you are storing the return value to, as the error
    messages from AWS are extremely helpful. You won't see the helpful error
    messages if you don't print them or return them to your frontend.
    """
    try:
        # print('====================in aws helper function==file:', file)
        # print('====================in aws helper function==file.name:', file.filename)
        # print('====================in aws helper function==bucket name:', BUCKET_NAME)
        # print('====================in aws helper function==content_type:', file.content_type)
        s3.upload_fileobj(
            file,
            BUCKET_NAME,
            file.filename,
            ExtraArgs={"ACL": acl, "ContentType": file.content_type},
        )
    except Exception as e:
        # in case the your s3 upload fails
        # print('====================in aws helper function==exception:', str(e))
        return {"message": str(e)}

    return {"url": f"{S3_LOCATION}{file.filename}"}


def remove_file_from_s3(url):
    """
    AWS needs the image file name, not the URL, so you split that out of the URL
    """
    key = url.rsplit("/", 1)[1]
    try:
        s3.delete_object(Bucket=BUCKET_NAME, Key=key)
    except Exception as e:
        return {"message": str(e)}
    return True
