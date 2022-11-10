import json
import boto3
import requests
import time
import datetime
from requests.auth import HTTPBasicAuth 
from requests_aws4auth import AWS4Auth
s3_client = boto3.client("s3")

region = 'us-east-1'
service = 'es'
credentials = boto3.Session().get_credentials()
awsauth = AWS4Auth(credentials.access_key, credentials.secret_key, region, service,
session_token=credentials.token)

def lambda_handler(event, context):

    s3_info = event['Records'][0]['s3']
    bucket_name = s3_info['bucket']['name']
    key_name = s3_info['object']['key']
    # print(event)
    # print(s3_client)
  
    client = boto3.client('rekognition')
    pass_object = {'S3Object':{'Bucket':bucket_name,'Name':key_name}}
    s3_head = s3_client.head_object(Bucket=bucket_name, Key = key_name)
    print(s3_head)
    #last_modified = s3_head["ResponseMetadata"]["HTTPHeaders"]["last-modified"]
    timestamp = s3_head["LastModified"].isoformat()
    
    resp = client.detect_labels(Image=pass_object)
    #meta_label = s3_head["Metadata"]["customlabels"]
    #print(meta_label)
    # print(event)
    
    #timestamp =event["Records"][0]["eventTime"]
    print(timestamp)
    labels = []
    if "customlabels" in s3_head["Metadata"].keys():
        meta_label = s3_head["Metadata"]["customlabels"].split(",")
        for i in meta_label:
            labels.append(i)
    
    # labels = [meta_label]
    
    for i in range(len(resp['Labels'])):
        labels.append(resp['Labels'][i]['Name'])
    print('<------------Now label list----------------->')
    print(labels)
    # time2 = timestamp.isoformat()
    # time = "{:%Y-%m-%dT%H}".format(timestamp)
    # print(time2)
    # print(time)
    format = {'objectKey':key_name,'bucket':bucket_name,'createdTimestamp':timestamp,'labels':labels}
    print(format)
    
    # region = 'us-east-1'
    # service = 'es'
    # credentials = boto3.Session().get_credentials()
    # awsauth = AWS4Auth(credentials.access_key, credentials.secret_key, region, service,
    # session_token=credentials.token)
    # print(awsauth)
    url = "https://search-photos-sz37uk72cb7osucbxao6aglvcq.us-east-1.es.amazonaws.com/photos/photos"
    headers = {"Content-Type": "application/json"}
    
    r = requests.post(url, auth = awsauth, headers=headers, data=json.dumps(format).encode("utf-8"))
    print(r.text)
    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin": '*'
        },
        "isBase64Encoded": False
    }