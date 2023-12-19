// userDB.js
import db from '../database/database';

export const getUser = () => {
    return new Promise((resolve, reject) => {
      db.transaction(
        (tx) => {
          tx.executeSql(
            'SELECT * FROM usuario',
            [],
            (_, result) => {
              try {
                const rows = result.rows._array;
                resolve(rows);
              } catch (error) {
                reject(error);
              }
            },
            (_, error) => {
              reject(error);
            }
          );
        },
        (error) => {
          console.error('Transaction error:', error);
          reject(error);
        },
        () => {
          console.log('Transaction success');
        }
      );
    });
};  

export const insertUser = () => {
    return new Promise((resolve, reject) => {
      const currentDate = new Date().toISOString();
  
      db.transaction((tx) => {
        tx.executeSql(
          'INSERT INTO usuario (nome, ultimoLogin) VALUES (?, ?)',
          ['Pedro', currentDate],
          (_, result) => {
            console.log('Inserção de usuário bem-sucedida');
            resolve(result);
          },
          (_, error) => {
            console.error('Erro ao inserir usuário:', error);
            reject(error);
          }
        );
      });
    });
  };