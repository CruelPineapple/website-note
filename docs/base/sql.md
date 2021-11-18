# SQL

腾讯面的时候说，前端最好也懂数据库和后端

sql是大小写不敏感的

## select

select column_name, column_name from table_name

select * from table_name

按照列名选表

哈哈😄 基本算是我会的唯一一个语句了（实验课不算，早忘了）

### select distinct

去除列中的重复值

select distinct column_name, column_name from table_name

### select where

有条件地选取，where column_name operator value，where关键字后跟列名 + 操作符 + 值

## and or

用于多个条件的查询，用括号安排顺序，例如：

```sql
SELECT * FROM Websites
WHERE alexa > 15
AND (country='CN' OR country='USA');
```

## order by

