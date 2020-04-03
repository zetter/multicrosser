class Crossword

  def initialize(crossword_data)
    @title = crossword_data.fetch('title')
    @source = crossword_data.fetch('source')
    @series = crossword_data.fetch('series')
    @identifier = crossword_data.fetch('identifier')
    @date = crossword_data.fetch('date')
  end

  attr_reader :title, :source, :series, :identifier

  def date
    (Time.xmlschema(@date).utc + 2.hours).to_date
  end

  def name
    formatted_time = date.strftime("%A %-d %b")
    if title.include?(' No ')
      number = title.split(' No ').last
      "#{formatted_time} (No #{number})"
    else
      "#{formatted_time}"
    end
  end

  def ==(other)
    other && other.instance_of?(Crossword) && other.identifier == self.identifier
  end

  def to_json
    {
      title: @title,
      source: @source,
      series: @series,
      identifier: @identifier,
      date: @date
    }.to_json
  end

  def save
    key = "crossword-series-#{self.series}"
    crosswords = JSON.parse(redis.get(key) || '[]').map{|crossword_data| Crossword.new(crossword_data)}
    if crosswords.none? { |existing_crossword| existing_crossword == self }
      crosswords.unshift(self)
      redis.set(key, crosswords.take(5).to_json)
    end
  end

  def redis
    @redis ||= Redis.new
  end

end
