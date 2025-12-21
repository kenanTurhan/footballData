import psycopg2

class PostgresPipeline:
    def open_spider(self, spider):
        self.conn = psycopg2.connect(
            host="localhost",
            database="tondbname",
            user="tonuser",
            password="tonpassword"
        )
        self.cursor = self.conn.cursor()

    def close_spider(self, spider):
        self.cursor.close()
        self.conn.close()

    def process_item(self, item, spider):
        dates = item['dates']
        scores = item['scores']

        # Exemple : insertion ligne par ligne
        for date, score in zip(dates, scores):
            self.cursor.execute(
                "INSERT INTO stats (date, score) VALUES (%s, %s)",
                (date, score)
            )

        self.conn.commit()
        return item
