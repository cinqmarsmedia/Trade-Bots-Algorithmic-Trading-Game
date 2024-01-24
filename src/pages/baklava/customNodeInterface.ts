
import { Component, Prop, Inject } from "vue-property-decorator";
import Vue from 'vue';

// @ts-ignore
import ClickOutside from "v-click-outside";
import { ViewPlugin } from "@baklavajs/plugin-renderer-vue";

import { compileToFunctions } from 'vue-template-compiler';
type INodeInterface = any;
type EditorView = any;

@Component({
    directives: {
        ClickOutside: ClickOutside.directive,
    },
    ...compileToFunctions(`
  <template>
    <div :id="data.id" :class="classes">
        <div class="__port" v-bind:class="{botEditorTrueValue: value===true, botEditorFalseValue: value===false}" @mouseover="startHover" @mouseout="endHover"></div>
        <span v-if="data.connectionCount > 0 || !data.option || !getOptionComponent(data.option)" class="align-middle">
            {{ displayName }}
            <!-- uncomment this to enable input node value display in realtime view <span v-bind:class="{botEditorTrueValue: value===true, botEditorFalseValue: value===false}" v-if="(displayName=='Output' || displayName=='Result' || displayName=='Then' || displayName=='Else') && classes['--connected']" style="position:absolute; margin-top:-12px; margin-left:25px;color: white; font-size:10px;">{{typeof value==="number"?Math.round(value*100)/100:value}}</span> -->
            <span v-bind:class="{liveValue: true, botEditorTrueValue: value===true, botEditorFalseValue: value===false}" v-if="!(displayName=='Output' || displayName=='Result' || displayName=='Then' || displayName=='Else') && classes['--connected']" style="position:absolute; margin-top:-12px; right:69px !important;color: white; font-size:10px;">{{typeof value==="number"?(Math.round(value*100)/100).toLocaleString():value}}</span>
        </span>
        <component
            v-else
            :is="getOptionComponent(data.option)"
            :option="data"
            :value="value"
            @input="data.value = $event"
            :name="displayName"
        ></component>
    </div>
</template>
`)
})
export class CustomNodeInterfaceView extends Vue {
    @Prop({ type: Object, default: () => ({}) })
    data: INodeInterface;
    @Prop({ type: String, default: "" })
    name: string;
    @Inject("plugin")
    plugin: ViewPlugin;
    @Inject("editor")
    editor: EditorView;
    value: any = null;
    isConnected = false;
    get classes() {
        return {
            "node-interface": true,
            "--input": this.data.isInput,
            "--output": !this.data.isInput,
            "--connected": this.isConnected
        };
    }
    get displayName() {
        return this.data.displayName || this.name;
    }
    beforeMount() {
        this.value = this.data.value;
        this.data.events.setValue.addListener(this, (v) => { this.value = v; });
        this.data.events.setConnectionCount.addListener(this, (c) => {
            this.$forceUpdate();
            this.isConnected = c > 0;
        });
        this.data.events.updated.addListener(this, (v) => { this.$forceUpdate(); });
        this.isConnected = this.data.connectionCount > 0;
    }
    mounted() {
        this.plugin.hooks.renderInterface.execute(this);
    }
    updated() {
        this.plugin.hooks.renderInterface.execute(this);
    }
    beforeDestroy() {
        this.data.events.setValue.removeListener(this);
        this.data.events.setConnectionCount.removeListener(this);
        this.data.events.updated.removeListener(this);
    }
    startHover() {
        this.editor.hoveredOver(this.data);
    }
    endHover() {
        this.editor.hoveredOver(undefined);
    }
    getOptionComponent(name: string) {
        if (!name || !this.plugin.options) { return; }
        return this.plugin.options[name];
    }
}

export default CustomNodeInterfaceView