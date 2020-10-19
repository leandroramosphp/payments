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

CREATE TABLE client_payment_credit_card(
    id SERIAL PRIMARY KEY,    
    client_payment_id INTEGER NOT NULL,
    id_payment TEXT NOT NULL,
    first4_digits TEXT NOT NULL,
    last4_digits TEXT NOT NULL,
    expiration_month TEXT NOT NULL,
    expiration_year TEXT NOT NULL,
    holder_name TEXT NOT NULL,
    enabled BOOLEAN DEFAULT TRUE 
);

ALTER TABLE client_payment_credit_card ADD CONSTRAINT client_payment_id_fk FOREIGN KEY(client_payment_id) REFERENCES client_payment(id);

CREATE TABLE store_payment_bank_account(
    id SERIAL PRIMARY KEY,    
    store_payment_id INTEGER NOT NULL,
    bank_account_id TEXT NOT NULL,
    bank_name TEXT NOT NULL,
    routing_number INTEGER NOT NULL,
    account_number INTEGER NOT NULL, 
    enabled BOOLEAN DEFAULT TRUE 
);

ALTER TABLE store_payment_bank_account ADD CONSTRAINT store_payment_id_fk FOREIGN KEY(store_payment_id) REFERENCES store_payment(id);

CREATE TABLE payment_transaction(
    id SERIAL PRIMARY KEY,    
    value INTEGER NOT NULL,
    store_id TEXT NOT NULL,
    card_id INTEGER NOT NULL,
    portion real NOT NULL,
    invoice TEXT,
    status TEXT NOT NULL DEFAULT 'pending' 
);

ALTER TABLE payment_transaction ADD CONSTRAINT card_id_fk FOREIGN KEY(card_id) REFERENCES client_payment_credit_card(id);

CREATE TABLE associate_invoice(
    id SERIAL PRIMARY KEY,    
    payment_id INTEGER NOT NULL,
    invoice TEXT NOT NULL    
);

ALTER TABLE associate_invoice ADD CONSTRAINT payment_id_fk FOREIGN KEY(payment_id) REFERENCES payment_transaction(id);

INSERT INTO __db_version(version_date, author, comments) VALUES('2020-10-15', 'Maycon Aguiar Teixeira da Silva', 'Criação da tabela client_payment');

commit;
