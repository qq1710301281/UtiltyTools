import cmd
import json
import time
from concurrent.futures import ThreadPoolExecutor
import feishu

POLLING_INTERVAL = 2
cocos_file_path = 'D:/CocosProject/yawya_cocos/yawya_game/assets/CSV/'
cocos_language_file_path = 'D:/CocosProject/yawya_cocos/yawya_game/assets/CSV/zh_cn/'


class MyCmd(cmd.Cmd):
    intro = "配置同步工具，输入sync开始同步所有配置"
    prompt = "请输入命令："

    # 初始化
    def __init__(self):
        super().__init__()
        print("初始化...")
        self.config_tables = self.load_config_tables()
        self.file_info = self.creat_file_info()

    # 读取配置
    def load_config_tables(self):
        with open("config.json", "r", encoding="utf-8") as f:
            config_tables = json.load(f)
        return config_tables

    # 提取有效配置
    def creat_file_info(self):
        file_info = []
        for table_name, table_id in self.config_tables.items():
            print(f"Name: {table_name}, Id: {table_id}")
            sheetList = feishu.getSheetsId(table_id)
            for sheet in sheetList:
                file_info.append(
                    {
                        'table_name': table_name,
                        'sheet_name': sheet['title'],
                        'table_id': table_id,
                        'sub_id': sheet['sheet_id'],
                    }
                )
        print(file_info)
        return file_info

    # 开始同步
    def do_sync(self, args):
        """执行脚本 1，并接受一个参数"""
        if not args:
            print("开始同步所有配置")
            with ThreadPoolExecutor() as executor:
                executor.map(self.download_file, self.file_info)
            # for task in self.file_info:
            #     self.download_file(task)
        else:
            print(f"开始同步{args}配置")
            file_info = []
            for table_name, table_id in self.config_tables.items():
                if args == table_name:
                    sheetList = feishu.getSheetsId(table_id)
                    for sheet in sheetList:
                        file_info.append(
                            {
                                'table_name': table_name,
                                'sheet_name': sheet['title'],
                                'table_id': table_id,
                                'sub_id': sheet['sheet_id'],
                            }
                        )
                    with ThreadPoolExecutor() as executor:
                        executor.map(self.download_file, file_info)

    def download_file(self, file_info):
        table_name = file_info['table_name']
        sheet_name = file_info['sheet_name']
        table_id = file_info['table_id']
        sub_id = file_info['sub_id']

        # 创建导出任务
        ticket = feishu.create_export_task(table_id, sub_id)
        print(f"创建导出任务成功，ticket: {ticket}")

        # 轮询查询导出任务结果
        while True:
            result = feishu.query_export_task_result(ticket)
            print(result)
            if result["data"]["result"]["job_status"] == 0:
                print(f"查询导出任务结果成功，文件 token: {result['data']['result']['file_token']}")
                break
            elif result["data"]["result"]["job_status"] == 1 or result["data"]["result"]["job_status"] == 2:
                print("任务正在处理中，稍后再试...")
                time.sleep(POLLING_INTERVAL)
            else:
                print(f"任务处理失败，原因：{result['job_error_msg']}")
                return

        # 下载导出文件
        if table_name == 'language':
            file_path = cocos_language_file_path + table_name + ' - ' + sheet_name + '.csv'
        else:
            file_path = cocos_file_path + table_name + ' - ' + sheet_name + '.csv'
        feishu.download_export_file(result['data']['result']['file_token'], file_path)
        print(f"下载导出文件成功，保存至 {file_path}")

    def do_exit(self, args):
        """退出程序"""
        print("退出程序。")
        return True


if __name__ == "__main__":
    MyCmd().cmdloop()
