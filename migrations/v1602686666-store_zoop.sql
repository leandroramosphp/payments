begin;

CREATE TABLE store_zoop(
    id	SERIAL NOT NULL PRIMARY KEY,
    store_id INTEGER NOT NULL
)

ALTER TABLE client_zoop ADD CONSTRAINT client_id_fk FOREIGN KEY(client_id) REFERENCES client_mall(client_id);
ALTER TABLE client_zoop ADD CONSTRAINT mall_id_fk FOREIGN KEY(mall_id) REFERENCES client_mall(mall_id);

INSERT INTO __db_version(version_date, author, comments) VALUES('2020-10-13', 'Maycon Aguiar Teixeira da Silva', 'Criação da tabela store_zoop');


commit;

