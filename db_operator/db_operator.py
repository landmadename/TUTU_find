import sqlite3
import time
from fuzzywuzzy import fuzz


class db():
    def __init__(self, db_path='big_box.db'):
        self.table_name = 'big_box'
        self.column = ['id', 's_key', 'name', 'count',
                       'from_', 'to_', 'place', 'in_time', 'out_time']
        self.conn = sqlite3.connect(db_path, check_same_thread=False)

    def get_data_from_table(self):
        self.cursor = self.conn.cursor()
        data = list(self.cursor.execute("select * from " + self.table_name))
        return data

    def search(self, kw, ls):
        kw = ' '.join([i for i in kw])
        ls = list(map(lambda n: ' '.join([i for i in n]), ls))
        data = [(fuzz.token_set_ratio(i, kw), i) for e, i in
                enumerate(ls)]
        data.sort(reverse=True)
        data = [i for i in data if i[0] >= 85]
        return [i[1] for i in data]

    def find(self, skey, sth, mode):
        def find_them(skey, sth):
            data = list(self.cursor.execute("select " +
                                            need_to_find +
                                            " from " +
                                            self.table_name +
                                            " where name='" +
                                            sth +
                                            "' and s_key='" +
                                            skey +
                                            "';"
                                            ))
            return data

        def find_similar(skey, sth):
            data = list(self.cursor.execute("select name from " +
                                            self.table_name +
                                            " where name like '%" +
                                            '%'.join([i for i in sth]) +
                                            "%'"
                                            " and s_key='" +
                                            skey +
                                            "';"
                                            ))
            return data

        need_to_find = ', '.join(self.column[2:])
        self.cursor = self.conn.cursor()
        data = find_them(skey, sth)
        if data == []:
            data = find_similar(skey, sth)
            if len(data) == 1:
                sth = data[0][0]
                data = find_them(skey, sth)
                return (1, data)
            else:
                similar_names = [i[0] for i in data]
                similar_names = self.search(sth, similar_names)
                similar_names = [i.replace(' ', '') for i in similar_names]
                if similar_names == []:
                    return (2, [])
                if mode == 1:
                    data = find_them(skey, similar_names[0])
                    return (1, data)
                return(0, similar_names)
        else:
            return (1, data)

    def get(self, skey):
        def get_all_by_skey(skey):
            data = list(self.cursor.execute("select " +
                                            need_to_find +
                                            " from " +
                                            self.table_name +
                                            " where s_key='" +
                                            skey +
                                            "';"
                                            ))
            return data

        need_to_find = ', '.join([self.column[0]] + self.column[2:])
        self.cursor = self.conn.cursor()
        return get_all_by_skey(skey)

    def post(self, skey, data):
        def insert_one(data):
            data = str(tuple(data))
            data = data.replace('None', 'NULL')
            print(data)
            self.cursor.execute("insert INTO big_box values " +
                                data)

        def delete_one(index):
            index = str(index)
            self.cursor.execute("delete from big_box where id=" +
                                index)
        self.cursor = self.conn.cursor()
        add = data.get('+')
        delete = data.get('-')
        modify = data.get('!')
        for i in add:
            i[0] = None
            i[-2] = str(time.time())
            i.insert(1, skey)
            print(i)
            insert_one(i)
        for i in delete:
            delete_one(i[0])
        for i in modify:
            delete_one(i[0])
            i[-2] = str(time.time())
            i.insert(1, skey)
            insert_one(i)
        self.conn.commit()

    def close(self):
        self.conn.commit()
        self.conn.close()


'''d = db(db_path='../big_box.db')
print(d.get("test key"))
d.close()'''
