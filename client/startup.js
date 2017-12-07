import Promise from "bluebird";
//add more libraries.
import {db} from "engine/db";
import app from "engine/app";
import {auth} from "engine/auth";
db.setup().then(auth.setup).then(app.setup);