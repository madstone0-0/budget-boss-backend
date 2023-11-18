-- Category
ALTER TABLE category DROP CONSTRAINT IF EXISTS category_color_regex;
ALTER TABLE category ADD CONSTRAINT category_color_regex CHECK (color ~ $$\#[A-Za-z0-9]{3,6}$$ );

ALTER TABLE category DROP CONSTRAINT IF EXISTS category_name_regex;
ALTER TABLE category ADD CONSTRAINT category_name_regex CHECK (name ~ $$[A-Za-z0-9\-\_ ]{1,50}$$ );


-- User
-- Regex from https://stackoverflow.com/a/201378
ALTER TABLE public."user" DROP CONSTRAINT IF EXISTS email_regex;
ALTER TABLE public."user" ADD CONSTRAINT email_regex 
CHECK (email ~ $$(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$$
);

-- Budget
ALTER TABLE budget DROP CONSTRAINT IF EXISTS budget_name_regex;
ALTER TABLE budget ADD CONSTRAINT budget_name_regex CHECK (name ~ $$[A-Za-z0-9\-\_ ]{1,50}$$ );
