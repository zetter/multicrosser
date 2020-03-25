class CrosswordFeed
  def feed
    return @feed if @feed
    json_feed = if redis.exists('crossword-feed')
      redis.get('crossword-feed')
    else
      get_feed.tap {|data| redis.set('crossword-feed', data, ex: 1.hour.to_i) }
    end
    @feed = JSON.parse(json_feed)
  end

  private

  def get_feed
    response = Faraday.get "https://www.theguardian.com/crosswords/rss"
    xml = Nokogiri::XML(response.body)
    xml.css('item').map do |element|
      link = element.css('link').text
      series, identifier = link.split('/').last(2)
      next unless series.in?(['quiptic', 'quick', 'weekend', 'cryptic', 'speedy', 'prize', 'everyman'])
      {
        title: element.css('title').text,
        source: 'guardian',
        series: series,
        identifier: identifier,
        date: element.at('dc|date').text
      }
    end.compact.to_json
  end

  def redis
    @redis ||= Redis.new
  end

end
