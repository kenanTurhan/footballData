import scrapy
from ..items import PlayerStatsItem

nom = "arda-guler"

class QuotesSpider(scrapy.Spider):
    name = "quotes"
    start_urls = [
        f"https://www.statmuse.com/fc/ask/{nom}-stats-last-10-games?l=eu5",
    ]

    custom_settings = {
        "DEFAULT_REQUEST_HEADERS": {
            "User-Agent": "Mozilla/5.0"
        }
    }

    def parse(self, response):
        item = PlayerStatsItem()

        item["dates"] = response.xpath('//a[contains(@href, "/fc/match/")]/div/span/text()').getall()
        item["scores"] = response.css("table tbody tr td:nth-child(10) span div span::text").getall()

        yield item
