namespace :crosswords do
  task load_from_feed: :environment do
    CrosswordFeed.load
  end

end
