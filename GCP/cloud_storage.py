from google.cloud import storage
import json, os

client = storage.Client(project="my-gcp-project")

def upload_file(bucket_name: str, local_path: str, blob_name: str = None) -> str:
    bucket   = client.bucket(bucket_name)
    blob_name = blob_name or os.path.basename(local_path)
    blob     = bucket.blob(blob_name)
    blob.upload_from_filename(local_path)
    uri = f"gs://{bucket_name}/{blob_name}"
    print(f"Uploaded to {uri}")
    return uri

def download_file(bucket_name: str, blob_name: str, dest_path: str) -> None:
    client.bucket(bucket_name).blob(blob_name).download_to_filename(dest_path)
    print(f"Downloaded to {dest_path}")

def list_files(bucket_name: str, prefix: str = "") -> list:
    return [b.name for b in client.list_blobs(bucket_name, prefix=prefix)]

def upload_json(bucket_name: str, data: dict, blob_name: str) -> str:
    blob = client.bucket(bucket_name).blob(blob_name)
    blob.upload_from_string(json.dumps(data, indent=2), content_type="application/json")
    return f"gs://{bucket_name}/{blob_name}"

if __name__ == "__main__":
    files = list_files("my-data-bucket", prefix="reports/")
    print("Files:", files)

