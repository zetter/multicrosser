

class RoomsController < ApplicationController
  def show
    raise ActionController::RoutingError.new('Source not Found') unless params[:source] == 'guardian'
    raise ActionController::RoutingError.new('Series not Found') unless params[:series].in?(['quiptic', 'quick', 'weekend', 'cryptic', 'speedy', 'prize', 'everyman'])
    @crossword = crossword
    @parsed_crossword = JSON.parse(crossword)
    @url = url
  end

  def crossword_identifier
    [params[:source], params[:series], params[:identifier]].join('/')
  end
  helper_method :crossword_identifier

  def crossword
    if redis.exists(crossword_identifier)
      redis.get(crossword_identifier)
    else
      get_crossword_data.tap {|data| redis.set(crossword_identifier, data) }
    end
  end

  def get_crossword_data
    response = Faraday.get(url)
    html = Nokogiri::HTML(response.body)
    crossword_element = html.css('.js-crossword')
    raise ActionController::RoutingError.new('Element not Found') unless crossword_element.any?
    crossword_element.first['data-crossword-data']
  end

  def url
    "https://www.theguardian.com/crosswords/#{params[:series]}/#{params[:identifier]}"
  end

  def redis
    @redis ||= Redis.new
  end
end
