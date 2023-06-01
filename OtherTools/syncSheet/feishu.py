# -*- coding: utf-8 -*-
import requests


token_url = 'https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal'

data = {
    'app_id': 'cli_a335130525bf900e',
    'app_secret': 'h8182l4wNphXELxw2dj4MhmcTwibLXAk'
}

token_rq = requests.post(token_url, data=data).json()
request_token = token_rq['tenant_access_token']

Authorization = 'Bearer ' + request_token
my_headers = {
    'Authorization': Authorization,
    'Content-Type': 'application/json; charset=utf-8'
}


def getSheetIdByName(spreadsheetToken: str,sheet_name:str):
    url = 'https://open.feishu.cn/open-apis/sheets/v3/spreadsheets/' + spreadsheetToken + '/sheets/query'
    rq = requests.get(url, headers=my_headers).json()['data']['sheets']
    for sheet in rq:
        if sheet['title'] == sheet_name:
            return sheet['sheet_id']
    return None

def getSheetsId(spreadsheetToken: str):
    idList = []
    url = 'https://open.feishu.cn/open-apis/sheets/v3/spreadsheets/' + spreadsheetToken + '/sheets/query'
    rq = requests.get(url, headers=my_headers).json()['data']['sheets']
    # for sheet in rq:
    #     idList.append(sheet['sheet_id'])
    return rq

def create_export_task(table_id: str,sub_id: str):
    CREATE_EXPORT_TASK_URL = 'https://open.feishu.cn/open-apis/drive/v1/export_tasks'
    CREATE_EXPORT_TASK_DATA = {
        "file_extension": "csv",
        "token": table_id,
        "type": "sheet",
        "sub_id": sub_id
    }
    response = requests.post(CREATE_EXPORT_TASK_URL, json=CREATE_EXPORT_TASK_DATA, headers=my_headers)
    response.raise_for_status()
    return response.json()["data"]["ticket"]

def query_export_task_result(ticket: str):
    QUERY_EXPORT_TASK_RESULT_URL = 'https://open.feishu.cn/open-apis/drive/v1/export_tasks/' + ticket + '?token=' + ticket
    response = requests.get(QUERY_EXPORT_TASK_RESULT_URL, headers=my_headers)
    response.raise_for_status()
    return response.json()

def download_export_file(token: str, file_path: str):
    DOWNLOAD_EXPORT_FILE_URL = 'https://open.feishu.cn/open-apis/drive/v1/export_tasks/file/' + token +'/download'
    response = requests.get(DOWNLOAD_EXPORT_FILE_URL, headers=my_headers, stream=True)
    response.raise_for_status()
    with open(file_path, "wb") as f:
        for chunk in response.iter_content(chunk_size=8192):
            chunk = chunk.replace(b'\n', b'\r\n')
            f.write(chunk)
