create table if not exists teams (
  id varchar not null primary key,
  name text not null
);

create table if not exists games (
  id varchar not null primary key,
  home_team varchar not null references teams(id),
  away_team varchar not null references teams(id),
  in_process BOOLEAN DEFAULT FALSE
);

create table if not exists players (
  id varchar not null primary key,
  name varchar,
  team varchar references teams(id),
  age integer,
  number integer,
  position varchar
);


create table if not exists stats (
  game_id varchar not null references games(id),
  player_id varchar not null references players(id),
  assists integer,
  goals integer,
  hits integer,
  points integer,
  penalty_minutes integer,
  update_at  timestamp with time zone NOT NULL DEFAULT NOW(),
  PRIMARY KEY(game_id, player_id)
);

