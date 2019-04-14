defmodule ElipadWeb.Router do
  use ElipadWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", ElipadWeb do
    pipe_through :browser

    get "/", PageController, :index
    get "/:page", PageController, :show
  end

  # Other scopes may use custom stacks.
  # scope "/api", ElipadWeb do
  #   pipe_through :api
  # end
end
