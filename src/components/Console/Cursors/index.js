import store from '../../../store';
import {CURSOR_TAG} from '../../../modules/console';

export class Caret {
    constructor(id, interval, options){
        this.id = id;
        this.current = 0;
        this.interval = interval;
        this.options = options;
    }

    tick(){
        this.current ++;

        if (this.current === this.interval){
            if (this.options.current === this.options.tags.length - 1){
                this.options.current = 0;
            }
            else {
                this.options.current ++;
            }

            let tag = this.options.tags[this.options.current];

            store.dispatch({
                type:CURSOR_TAG,
                cursor: {
                    id: this.id, 
                    tag
                }
            })

            this.current = 0;
        }
    }
}