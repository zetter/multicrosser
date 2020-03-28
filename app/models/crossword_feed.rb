class CrosswordFeed
  def self.load
    response = Faraday.get "https://www.theguardian.com/crosswords/rss"
    xml = Nokogiri::XML(response.body)
    xml.css('item').each do |element|
      link = element.css('link').text
      series, identifier = link.split('/').last(2)
      next unless series.in?(Series::SERIES)

      crossword = Crossword.new(
        "title" => element.css('title').text,
        "source" => 'guardian',
        "series" => series,
        "identifier" => identifier,
        "date" => element.at('dc|date').text
      )
      crossword.save
    end
  end

  def self.redis
    @redis ||= Redis.new
  end

end
