class CrosswordsController < ApplicationController
  def show
    redirect_to room_path(
      source: params[:source],
      series: params[:series],
      identifier: params[:identifier],
      room: SecureRandom.uuid
    )
  end
end
