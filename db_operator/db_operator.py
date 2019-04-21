import sqlite3
from fuzzywuzzy import fuzz


class db():
    def __init__(self, db_path='big_box.db'):
        self.table_name = 'big_box'
        self.need_to_find = 'name, count, from_, to_, place, in_time, out_time'
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
                                            self.need_to_find +
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

    def close(self):
        self.conn.commit()
        self.conn.close()


'''d = db(db_path='../big_box.db')
print(d.find('test key', 'hi', 1))
d.close()
'''
