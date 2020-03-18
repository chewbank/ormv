'use strict';

class Sync {
  /**
   * 
   * @param {string} mode 同步模式
   * @param {string} schema 
   */
  async sync(mode, schema = 'public') {

    if (mode) {
      return await this[mode](schema);
    } else {
      return await this.default(schema);
    }

  }
  async default(schema) {

    const fields = this._fields(schema);

    const sql = `CREATE TABLE IF NOT EXISTS "${schema}"."${this.name}" (${fields});`

    this.logger(sql);

    const result = await this.client.query(sql);

    await this._uniqueIndex(schema, this.fields);

    return result;

  }
  async rebuild(schema) {

    const fields = this._fields();

    const sql = `DROP TABLE IF EXISTS "${schema}"."${this.name}" CASCADE;CREATE TABLE "${schema}"."${this.name}" (${fields});`

    this.logger(sql);

    const result = await this.client.query(sql);

    await this._uniqueIndex(schema, this.fields);

    return result;

  }
  async increment(schema) {

    const sql = `SELECT DISTINCT a.attname as name FROM pg_attribute a JOIN pg_class pgc ON pgc.oid = a.attrelid LEFT JOIN pg_index i ON (pgc.oid = i.indrelid AND i.indkey[0] = a.attnum) LEFT JOIN pg_description com on (pgc.oid = com.objoid AND a.attnum = com.objsubid) LEFT JOIN pg_attrdef def ON (a.attrelid = def.adrelid AND a.attnum = def.adnum) WHERE a.attnum > 0 AND pgc.oid = a.attrelid AND pg_table_is_visible(pgc.oid) AND NOT a.attisdropped AND pgc.relname = '${this.name}' ORDER BY a.attname;`

    this.logger(sql);

    const { rows } = await this.client.query(sql);

    if (rows.length) {

      const fields = [];

      for (const item of rows) {
        fields.push(item.name);
      }

      const sqlArray = [];

      for (const name in this.fields) {

        if (fields.includes(name) === false) {

          const item = this.fields[name];
          const { default: Default, alias, type } = item;

          const defaultSql = Default ? ` DEFAULT '${Default}'` : '';

          sqlArray.push(`ALTER TABLE "${schema}"."${this.name}" ADD COLUMN "${name}" ${alias || type}${defaultSql}`);

        }

      }

      if (sqlArray.length) {

        const sql = sqlArray.join('; ')

        this.logger(sql);

        return await this.client.query(sql);

      }

      await this._uniqueIndex(schema, this.fields);

    } else {

      return await this.default(schema);

    }

  }
  _fields() {

    const fields = [];

    for (const name in this.fields) {

      const item = this.fields[name];

      if (item.primaryKey) {

        fields.push(`"${name}" SERIAL`);
        fields.push(`PRIMARY KEY ("${this.primaryKey}")`);

      } else {

        const { default: Default, alias, type } = item;

        const defaultSql = Default ? ` DEFAULT ${Default}` : '';

        fields.push(`"${name}" ${alias || type}${defaultSql}`);

      }

    }

    // 缺省状态下自动将id设为主键
    if (!this.primaryKey) {

      fields.unshift(`PRIMARY KEY ("id")`);
      fields.unshift(`"id" SERIAL`);

    }

    return fields.join(', ');

  }
  async _uniqueIndex(schema, fields) {

    let sql = '';

    for (const name in fields) {

      const item = fields[name];

      if (item.uniqueIndex === true) {
        const row = `CREATE UNIQUE INDEX IF NOT EXISTS "${this.name}_${name}_unique" ON "${schema}"."${this.name}" USING btree ("${name}" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST);`
        this.logger(row);
        sql += row;
      }

    }

    await this.client.query(sql);

  }
}

module.exports = Sync;