/**
 * Pool Manager for singleton <Component>,replace <ComponentPool> when a component is registered with maxsize==0
 * @param ComponentType
 * @param ecs
 * @constructor
 */

export class ComponentSingleton {
    constructor(ComponentType, ecs) {
        this._component = ComponentType;            //给对象赋值
        this._instance = null;
        this._name = ComponentType.defineName;  //名称为对象定义的原型名
        this._ecs = ecs;
    }

    /**
     * create a <Component> and call it's onCreate method
     * @returns Component
     */
    create() {
        let args = [].slice.call(arguments);
        this._instance = Object.create(this._component.prototype);
        this._component.prototype.constructor.apply(this._instance, args);
        this._instance._dirty = true;
        this._instance._ecs = this._ecs;
        if (this._instance.onCreate) {
            this._instance.onCreate(this._ecs);
        }
        return this._instance;
    }

    /**
     * recycle <Component>
     * @param comp
     */
    recycle(comp) {
        if (this._instance) {
            this._instance.onDestroy && this._instance.onDestroy(this._ecs);
        }
        this._instance = null;
    }

    /**
     * pop a <Component> or create one
     * @returns {*}
     */
    get() {
        let args = [].slice.call(arguments);
        if (this._instance) {
            if (args.length > 0) {
                this._component.prototype.constructor.apply(this._instance, args);
            }
            return this._instance;
        } else {
            return this.create.apply(this, args);
        }
    }

    update(dt) {

    }

    destroy() {
        if (this._instance) {
            this._instance.destroy();
        }
        this._instance = null;
    }
}


