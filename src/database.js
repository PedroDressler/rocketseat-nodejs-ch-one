import {promises as fs} from 'node:fs'

const databasePath = new URL('db.json', import.meta.url)

export class Database {
  #database = {}

  constructor() {
    fs.readFile(databasePath, 'utf8')
      .then(data => { this.#database = JSON.parse(data) })
      .catch(() => {
        this.#persist();
      })
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database, null, 2, 1));
  }

  select(table, search) {
    let data = this.#database[table] ?? [];
    
    if(search) {
      data = data.filter(row => {
        return Object.entries(search).some(([table, value]) => {
          return row[table].toLowerCase().includes(value.toLowerCase());
        })
      })
    }

    return data;
  }

  insert(table, data) {
    if(Array.isArray(this.#database[table])){
      this.#database[table].push(data);
    } else {
      this.#database[table] = [data]
    }

    this.#persist();
    return data;
  }

  delete(table, id) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id);
    
    if(rowIndex == -1) return;
    
    this.#database[table].splice(rowIndex, 1);
    this.#persist();
  }

  update(table, id, data) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id);

    if(rowIndex == -1) return;
    const rowData = this.#database[table][rowIndex];
    this.#database[table][rowIndex] = {
      ...rowData,
      ...data,
      updated_at: new Date()
    }

    this.#persist();
  }

  updateCompletedTask(table, id) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id);

    if(rowIndex == -1) return;

    const rowData = this.#database[table][rowIndex];
    this.#database[table][rowIndex] = {
      ...rowData,
      updated_at: new Date(),
      completed_at: new Date()
    };

    this.#persist();
  }

}