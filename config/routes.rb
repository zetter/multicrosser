Rails.application.routes.draw do
  root 'page#index'

  get 'crossword/:source/:series/:identifier/:room', to: 'rooms#show', as: 'room'
  get 'crossword/:source/:series/:identifier', to: 'crosswords#show', as: 'crossword'
end
