begin;

CREATE TABLE client_zoop (
    id	SERIAL PRIMARY KEY,
    client_id INTEGER NOT NULL,
    mall_id INTEGER NOT NULL,
    id_zoop TEXT NOT NULL
);

ALTER TABLE client_zoop ADD CONSTRAINT client_id_mall_id_fk FOREIGN KEY(client_id, mall_id) REFERENCES client_mall(client_id, mall_id);

INSERT INTO __db_version(version_date, author, comments) VALUES('2020-10-13', 'Maycon Aguiar Teixeira da Silva', 'Criação da tabela client_zoop');

commit;
