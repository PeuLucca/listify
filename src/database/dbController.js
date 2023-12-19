// userDB.js
import db from './database';

export const initUserTables = () => { // create tables
  db.transaction((tx) => { // usuario
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS usuario (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT, ultimoLogin DATETIME)',
      [],
      (_, result) => {
        console.log('Usuario table created successfully');
      },
      (_, error) => {
        console.error('Error creating usuario table:', error);
      }
    );
  });

  db.transaction((tx) => { // lista
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS lista (id INTEGER PRIMARY KEY AUTOINCREMENT, usuarioId INTEGER, nome TEXT, percentagem REAL, qntTotal INTEGER, qntFaltante INTEGER, FOREIGN KEY(usuarioId) REFERENCES usuario(id))',
      [],
      (_, result) => {
        console.log('Lista table created successfully');
      },
      (_, error) => {
        console.error('Error creating lista table:', error);
      }
    );
  });

  db.transaction((tx) => { // produto
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS produto (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT, preco REAL, localCompra TEXT)',
      [],
      (_, result) => {
        console.log('Produto table created successfully');
      },
      (_, error) => {
        console.error('Error creating produto table:', error);
      }
    );
  });

  db.transaction((tx) => { // produtoLista
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS produtoLista (id INTEGER PRIMARY KEY AUTOINCREMENT, listaId INTEGER, produtoId INTEGER, comprado BOOLEAN, FOREIGN KEY(listaId) REFERENCES lista(id), FOREIGN KEY(produtoId) REFERENCES produto(id))',
      [],
      (_, result) => {
        console.log('ProdutoLista table created successfully');
      },
      (_, error) => {
        console.error('Error creating produtoLista table:', error);
      }
    );
  });
};
