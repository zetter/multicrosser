class PageController < ApplicationController
  def index
    @crossword_feed = CrosswordFeed.new
  end
end
