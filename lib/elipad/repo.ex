defmodule Elipad.Repo do
  use Ecto.Repo,
    otp_app: :elipad,
    adapter: Ecto.Adapters.Postgres
end
