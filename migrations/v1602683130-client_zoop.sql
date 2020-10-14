begin;

CREATE TABLE client_zoop (
    id	SERIAL NOT NULL PRIMARY KEY,
    client_id INTEGER NOT NULL,
    mall_id INTEGER NOT NULL,
    id_zoop TEXT NOT NULL
);

ALTER TABLE client_zoop ADD CONSTRAINT client_id_fk FOREIGN KEY(client_id) REFERENCES client(id);
ALTER TABLE client_zoop ADD CONSTRAINT mall_id_fk FOREIGN KEY(mall_id) REFERENCES mall(id);

INSERT INTO __db_version(version_date, author, comments) VALUES('2020-10-13', 'Maycon Aguiar Teixeira da Silva', 'Criação da tabela client_zoop');

commit;
