import { typeUser } from "./userSchema";
import { typeCategory } from "./categorySchema";
import { typeProduct } from "./productSchema";
import { typeOrder } from "./orderSchema";

const schema = [typeUser, typeCategory, typeProduct, typeOrder];
export default schema;
