class PageController < ApplicationController
  def index
    @series_with_crosswords = Series.get_all
  end
end
