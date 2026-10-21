create extension if not exists btree_gist;
create table profiles(id uuid primary key references auth.users on delete cascade,full_name text,email text,role text not null default 'user' check(role in('user','admin')),avatar_url text,created_at timestamptz default now());
create function is_admin() returns boolean language sql security definer stable as $$select exists(select 1 from profiles where id=auth.uid() and role='admin')$$;
create function handle_new_user() returns trigger language plpgsql security definer as $$begin insert into profiles(id,email,full_name) values(new.id,new.email,new.raw_user_meta_data->>'full_name');return new;end$$;
create trigger on_auth_user after insert on auth.users for each row execute function handle_new_user();
create table properties(id uuid primary key default gen_random_uuid(),title text not null,description text,city text not null,country text not null,price_per_night numeric(10,2) not null check(price_per_night>0),property_type text not null check(property_type in('hotel','apartment','villa','homestay','rental')),category text check(category in('Beachfront','City Stays','Luxury','Nature','Budget')),capacity int not null check(capacity>0),amenities text[] default '{}',images text[] default '{}',rating numeric(2,1) default 0 check(rating between 0 and 5),review_count int default 0,host_id uuid references profiles(id),created_at timestamptz default now());
create index on properties(city);create index on properties(price_per_night);
create table bookings(id uuid primary key default gen_random_uuid(),user_id uuid not null references profiles(id) on delete cascade,property_id uuid not null references properties(id) on delete cascade,check_in date not null,check_out date not null,guests int not null check(guests>0),total_price numeric(10,2) not null,status text not null default 'confirmed' check(status in('pending','confirmed','cancelled')),reference text unique not null,created_at timestamptz default now(),check(check_out>check_in),
exclude using gist(property_id with =,daterange(check_in,check_out) with &&) where(status<>'cancelled'));
create index on bookings(user_id);
create table favorites(user_id uuid references profiles(id) on delete cascade,property_id uuid references properties(id) on delete cascade,primary key(user_id,property_id));
create table reviews(id uuid primary key default gen_random_uuid(),user_id uuid references profiles(id),property_id uuid references properties(id) on delete cascade,rating int not null check(rating between 1 and 5),comment text,created_at timestamptz default now());
alter table profiles enable row level security;alter table properties enable row level security;alter table bookings enable row level security;alter table favorites enable row level security;alter table reviews enable row level security;
create policy "own profile read" on profiles for select using(id=auth.uid() or is_admin());
create policy "own profile update" on profiles for update using(id=auth.uid()) with check(id=auth.uid() and role=(select role from profiles where id=auth.uid()));
create policy "public properties" on properties for select using(true);
create policy "admin properties" on properties for all using(is_admin()) with check(is_admin());
create policy "own bookings read" on bookings for select using(user_id=auth.uid() or is_admin());
create policy "own bookings insert" on bookings for insert with check(user_id=auth.uid());
create policy "own bookings update" on bookings for update using(user_id=auth.uid() or is_admin());
create policy "own favorites" on favorites for all using(user_id=auth.uid()) with check(user_id=auth.uid());
create policy "public reviews" on reviews for select using(true);
create policy "own reviews" on reviews for insert with check(user_id=auth.uid());
-- Seed
insert into properties(title,description,city,country,price_per_night,property_type,category,capacity,amenities,images,rating,review_count) values
('Oceanview Villa','Private villa steps from the sand with infinity pool.','Goa','India',220,'villa','Beachfront',6,'{WiFi,Pool,Kitchen,AC}','{https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200,https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=1200}',4.9,128),
('Skyline Loft','Modern loft in the heart of the city.','Mumbai','India',120,'apartment','City Stays',3,'{WiFi,Kitchen,AC,Gym}','{https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200}',4.6,84),
('The Grand Palace Hotel','Five-star luxury with spa and fine dining.','Jaipur','India',340,'hotel','Luxury',4,'{WiFi,Pool,Spa,Parking,AC}','{https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200}',4.8,203),
('Forest Hideaway Cabin','Quiet cabin surrounded by tea gardens.','Munnar','India',95,'homestay','Nature',4,'{WiFi,Fireplace,Kitchen}','{https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=1200}',4.7,61),
('Backpacker Studio','Clean, simple and close to everything.','Hyderabad','India',35,'apartment','Budget',2,'{WiFi,AC}','{https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200}',4.2,45),
('Lakeside Retreat','Wake up to misty lake views.','Udaipur','India',160,'rental','Nature',5,'{WiFi,Kitchen,Parking}','{https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1200}',4.8,97);
