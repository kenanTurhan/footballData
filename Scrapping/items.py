import scrapy

class PlayerStatsItem(scrapy.Item):
    dates = scrapy.Field()
    scores = scrapy.Field()
