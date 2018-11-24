class MovesChannel < ApplicationCable::Channel
  def subscribed
    stream_from(channel_name)

    data = redis.hgetall(channel_name)
    grid = Array.new(20) { Array.new(20) }

    data.each {|k, v|
      x, y = k.split('-')
      next if x.nil? or y.nil?
      next unless x.to_i.in?(0..20) && y.to_i.in?(0..20)
      grid[x.to_i][y.to_i] = v
    }

    transmit({'initialState': grid})
  end

  def move(data)
    redis.hmset(channel_name, "#{data['x']}-#{data['y']}", data['value'])
    ActionCable.server.broadcast(channel_name, data)
  end


  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  private

  def channel_name
    "moves_channel-#{params[:crossword]}-#{params[:room]}"
  end

  def redis
    @redis ||= Redis.new
  end
end
