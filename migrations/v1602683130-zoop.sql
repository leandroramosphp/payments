begin;

CREATE TABLE client_payment (
    id	SERIAL PRIMARY KEY,
    client_id INTEGER NOT NULL,
    mall_id INTEGER NOT NULL,
    id_payment TEXT NOT NULL
);

ALTER TABLE client_payment ADD CONSTRAINT client_id_mall_id_fk FOREIGN KEY(client_id, mall_id) REFERENCES client_mall(client_id, mall_id);

CREATE TABLE store_payment(
    id	SERIAL PRIMARY KEY,
    store_id INTEGER NOT NULL,
    mall_id INTEGER NOT NULL,
    id_payment TEXT NOT NULL
);

ALTER TABLE store_payment ADD CONSTRAINT store_id_mall_id_fk FOREIGN KEY(store_id, mall_id) REFERENCES store(id, mall_id);

CREATE TABLE store_payments_bank_acount(
    id	SERIAL PRIMARY KEY,    
    store_payment_id INTEGER NOT NULL,
    bank_acoount_id INTEGER NOT NULL
);

ALTER TABLE store_payments_bank_acount ADD CONSTRAINT store_payment_id_fk FOREIGN KEY(store_payment_id) REFERENCES client_payment(id);

CREATE TABLE client_payment_credit_card(
    id SERIAL PRIMARY KEY,    
    client_payment_id INTEGER NOT NULL,
    id_payment TEXT NOT NULL,
    first4_digits TEXT NOT NULL,
    last4_digits TEXT NOT NULL,
    expiration_month TEXT NOT NULL,
    expiration_year TEXT NOT NULL,
    holder_name TEXT NOT NULL,
    is_active TEXT NOT NULL,
    is_valid TEXT NOT NULL,
    is_verified TEXT NOT NULL
);

ALTER TABLE client_payment_credit_card ADD CONSTRAINT client_payment_id_fk FOREIGN KEY(client_payment_id) REFERENCES client_payment(id);

INSERT INTO __db_version(version_date, author, comments) VALUES('2020-10-13', 'Maycon Aguiar Teixeira da Silva', 'Criação da tabela client_payment');

commit;
