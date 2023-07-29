// create table if not exists driver (
//     driver_id integer not null primary key default nextval('user_id'),
//     name varchar(255) not null,
//     email varchar(255) not null,
//     phone varchar(255) not null,
//     password varchar(255) not null,
//     rating double precision
// );

module.exports = (sequelize, Sequelize) => {
    const DRIVER = sequelize.define("driver", {
        driver_id: { type: Sequelize.INTEGER, primaryKey: true },
        name: { type: Sequelize.STRING, allowNull: false },
        email: { type: Sequelize.STRING, allowNull: false },
        phone: { type: Sequelize.STRING, allowNull: false },
        password: { type: Sequelize.STRING, allowNull: false },
        rating: { type: Sequelize.DOUBLE, allowNull: true }
        });
    return DRIVER;
}