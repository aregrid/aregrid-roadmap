<template>
    <div class="">
        <div class="navbar">
            <h3>Z Roadmap</h3>
            <!-- <el-button class="btn-share btn-common" type="primary" @click="onClickBtnShare"><i class="el-icon-link"></i>共享</el-button> -->
        </div>
        <div class="caledar-view" ref="caledarView" @mousemove="onMouseMoveForCaledarView">
            <div class="caledar-view__item" v-for="timeNode in timeNodes">
                <div class="caledar-view__item__head-wrap">
                    <div class="caledar-view__item__MMM">
                        <span v-if="timeNode.whatMonthOfYear">{{timeNode.whatMonthOfYear}}</span>
                    </div>
                    <div class="caledar-view__item__head">
                        <div class="caledar-view__item__head__dd">{{timeNode.whatDayOfWeek}}</div>
                        <div class="caledar-view__item__head__D" :data-name="timeNode.name"><em>{{timeNode.whatDayOfMonth}}</em></div>
    
                    </div>
                </div>
    
                <div class="caledar-view__item__roadmap">
                    <ul class="caledar-view__item__roadmap__rows">
                        <li @mouseup="onMouseUpForRoadmapRowsItem" @mousedown="onMouseDownForRoadmapRowsItem" :class="{'building':draftRoadmapTimeline.isBuilding}" class="caledar-view__item__roadmap__rows__item" v-for="row in rows">
    
                        </li>
                    </ul>
                </div>
            </div>
            <div class="roadmap__timeline"  :class="{'building':draftRoadmapTimeline.isBuilding}" v-show="draftRoadmapTimeline.isBuilding" :style="draftRoadmapTimeLineStyle">
                <div class="roadmap__timeline__bd building">
                    {{draftRoadmapTimeline.property.dayCount}}
                </div>
            </div>
            <div class="roadmap__timeline"  v-for="(roadmapTimeLine,$index) in roadmapTimeLines" v-if="roadmapTimeLines.length" :style="this.buildRoadmapTimelineStyle(roadmapTimeLine)">
                <div class="roadmap__timeline__bd finish" :style="buildRoadmapTimelineBdStyle(roadmapTimeLine)" @click="randomBackgroundColor(roadmapTimeLine)">
                    {{roadmapTimeLine.property.text}}
                    <i class="el-icon-close roadmap__timeline__bd__btn-remove" @click.stop="onClickBtnRemoveOfRoadmapTimeline($index)"></i>
                </div>
            </div>
        </div>
        <el-dialog width="50%" custom-class="draft-roadmap-time-line-dialog" title="" v-model="dialogVisiableOfdraftRoadmapTimelineTextInput" @close="onDialogCloseChangeRoadmapTimelineTextInput">
            <el-input size="medium" v-model="draftRoadmapTimeline.property.text" ref="draftRoadmapTimelineTextInput" placeholder="Task name" v-on:keyup.enter="createRoadmapTimeline()" ></el-input>
        </el-dialog>
    </div>
</template>

<script>
var roadmapTimeLinesKey = 'roadmapTimeLines1.0'
export default {
    name: 'HelloWorld',
    props: {
        msg: String
    },
    data() {
        var roadmapTimeLines  =[];
        if(window.localStorage.getItem(roadmapTimeLinesKey)){
            roadmapTimeLines = JSON.parse(window.localStorage.getItem(roadmapTimeLinesKey));
        }
        return {
            count: 0,
            timeNodes: this.buildTimeNodes(),
            rows: new Array(40),
            draftRoadmapTimeline: this.getDraftRoadmaoTimeline(),
            roadmapTimeLines: roadmapTimeLines,
            dialogVisiableOfdraftRoadmapTimelineTextInput: false
        }
    },
    computed: {
        draftRoadmapTimeLineStyle: function() {
            return this.buildRoadmapTimelineStyle(this.draftRoadmapTimeline)
        }
    },
    methods: {
        buildRoadmapTimelineBdStyle(roadmapTimeLine){
            let color = '#222';
            if(roadmapTimeLine.property.backgroundColor && roadmapTimeLine.property.backgroundColor!=='#fff'){
                color = '#fff'
            }
            return {
               'background-color':roadmapTimeLine.property.backgroundColor?roadmapTimeLine.property.backgroundColor:'#fff',
               'color':color
            }
        },
        randomBackgroundColor(roadmapTimeLine){
            let colors = ['#295BE6','#2CBC63','#12B2E6','#774EE0','#AF4FD3','#E16AC0','#EB4962','#F1763A','#EAC00B']
            roadmapTimeLine.property.backgroundColor = colors[parseInt(Math.random()*colors.length)];
            // this.$forceUpdate();
            this.cache();;
            console.log(roadmapTimeLine.property.backgroundColor)
        },
        onClickBtnRemoveOfRoadmapTimeline(index){
            this.roadmapTimeLines.splice(index,1);
            this.cache();
        },
        onClickBtnShare(){
            alert('开发中');
        },
        buildRoadmapTimelineStyle(roadmapTimeline) {
            // console.log(roadmapTimeline.property)
            return {
                left: roadmapTimeline.property.left + 'px',
                top: roadmapTimeline.property.top + 'px',
                width: roadmapTimeline.property.width + 'px',
            }
        },
        getDraftRoadmaoTimeline() {
            return {
                isBuilding: false,
                isFinish: false,
                property: {
                    width: 0,
                    left: 0,
                    top: 0,
                    text: '',
                    backgroundColor:'#fff',
                    initialOffsetX:0,
                    initialLeft: 0,
                    initialTop: 0,
                    initialScreenX: 0
                },

            }
        },
        onMouseMoveForCaledarView(e) {
            if (this.draftRoadmapTimeline.isBuilding) {
               
                let delaX = e.screenX - this.draftRoadmapTimeline.property.initialScreenX;
                let width = delaX;
                // let width =  e.screenX - this.draftRoadmapTimeline.property.initialLeft;
                let newWidth = width < 0 ? 0 : width;
                // console.log(delaX)
                // console.log(e.screenX - this.draftRoadmapTimeline.property.initialLeft)
                 this.draftRoadmapTimeline.property.width = newWidth;
                if(newWidth<=60){
                    this.draftRoadmapTimeline.property.dayCount = 1;
                }else{
                    this.draftRoadmapTimeline.property.dayCount = 1+ Math.floor((newWidth-60)/60);
                }
                // this.draftRoadmapTimeline.property.initialScreenX = e.screenX;
                // this.draftRoadmapTimeline.property.initialScreenX = e.screenX;
            }
        },
        onMouseDownForRoadmapRowsItem(e) {
            if(this.draftRoadmapTimeline.isBuilding){
                this.onMouseUpForRoadmapRowsItem(e);
                return;
            }
            if (!this.draftRoadmapTimeline.isBuilding) {

                this.draftRoadmapTimeline.isFinish = false;
                this.draftRoadmapTimeline.isBuilding = true;
                // debugger;
                this.draftRoadmapTimeline.property.initialOffsetX = e.offsetX;
                this.draftRoadmapTimeline.property.initialLeft = e.currentTarget.getBoundingClientRect().x + this.$refs.caledarView.scrollLeft;
                this.draftRoadmapTimeline.property.initialTop = e.currentTarget.getBoundingClientRect().y - 60; //这个高度应该根据第几个roadmap计算 + this.$refs.caledarView.scrollTop
                this.draftRoadmapTimeline.property.initialScreenX = e.screenX;
                this.draftRoadmapTimeline.property.left = this.draftRoadmapTimeline.property.initialLeft;
                this.draftRoadmapTimeline.property.top = this.draftRoadmapTimeline.property.initialTop;
            }
        },
        onMouseUpForRoadmapRowsItem() {
            if (this.draftRoadmapTimeline.isBuilding) {
                // console.log(this.draftRoadmapTimeline.property)
                this.dialogVisiableOfdraftRoadmapTimelineTextInput = true;
                this.$nextTick(() => {
                    this.$refs.draftRoadmapTimelineTextInput.focus();
                })
            }
        },
        onDialogCloseChangeRoadmapTimelineTextInput() {
            this.dialogVisiableOfdraftRoadmapTimelineTextInput = false;
            this.newDraftRoadmaoTimeline();
        },
        createRoadmapTimeline() {
            this.dialogVisiableOfdraftRoadmapTimelineTextInput = false;
            this.draftRoadmapTimeline.isBuilding = false;
            this.draftRoadmapTimeline.isFinish = true;

            this.draftRoadmapTimeline.property.width = this.draftRoadmapTimeline.property.dayCount * 60;
            // this.draftRoadmapTimeline.
            // debugger;
            this.roadmapTimeLines.push({
                property: {
                    backgroundColor:this.draftRoadmapTimeline.property.backgroundColor,
                    left: this.draftRoadmapTimeline.property.left,
                    top: this.draftRoadmapTimeline.property.top,
                    width: this.draftRoadmapTimeline.property.width,
                    text: this.draftRoadmapTimeline.property.text
                }
            });

            this.newDraftRoadmaoTimeline();

            this.cache();
        },
        cache(){
            window.localStorage.setItem(roadmapTimeLinesKey,JSON.stringify(this.roadmapTimeLines))
        },
        newDraftRoadmaoTimeline(){
             this.draftRoadmapTimeline = this.getDraftRoadmaoTimeline();
        },
        buildTimeNodes() {
            const start = moment(new Date()).subtract(1, 'months');
            const end = moment(new Date()).add(4, 'months');
            const range = moment.range(start, end);

            let list = Array.from(range.by('day', { excludeEnd: true }));
            let result = list.map((item) => {
                let tmp = moment(item);
                let timeNode = {
                    name: tmp.format('YYYY-MM-DD'),
                    whatDayOfWeek: tmp.format('dd').substring(0, 1),
                    whatDayOfMonth: tmp.format('D'),
                };
                if (tmp.format('D') === '1') {
                    timeNode.whatMonthOfYear = tmp.format('MMM')
                }
                return timeNode;
            });
            return result;
        }
    },
    mounted() {
        this.$nextTick(() => {
            // debugger;
            this.$refs.caledarView.style.height = (document.documentElement.clientHeigh - 132) + 'px';
            let offsetDayCount = 30;
            this.$refs.caledarView.scrollLeft = 60 * offsetDayCount;
        });
    }
}
</script>

<style lang="less">
.navbar {
    background: black;
    height: 60px;
    padding: 0 15px;
    h3 {
        color: #fff;
        font-size: 24px;
        line-height: 60px;
        padding-left: 15px;
        display:inline-block;
    }
    &:after{
        content:" ";
        display:block;
        clear:both;
    }
}
.btn-common{
    background: #3062f2;
    border-color: #3062f2;
    width: 80px;
    height: 32px;
    padding: 0 24px;
    height: 32px;
    line-height: 32px;
    font-size: 14px !important;
    font-weight: 500;
    border-radius: 6px !important;
    border: none;
    box-shadow: none;
    text-shadow: none;
    font-family: PingFangSC-Medium,sans-serif;
}
.btn-share{
    float:right;
    margin-top:10px;
    .el-icon-link{
        vertical-align: -0.125em;
        margin-left: -6px;
        margin-right: 6px;
    }
}

.caledar-view {
    border-bottom: 1px solid #ebebeb;
    list-style: none;
    margin: 0;
    outline: 0;
    overflow-x: scroll;
    overflow-y: hidden;
    padding: 0;
    position: relative;
    user-select: none;
    white-space: nowrap;
    background-color: #fafafa;
}

.caledar-view__item {
    box-shadow: inset 1px 0 0 rgba(0, 0, 0, .06);
    width: 60px;
    height: 100%;
    display: -webkit-inline-box;
    display: -ms-inline-flexbox;
    display: inline-flex;
    justify-content: center;
    position: relative;
}

.caledar-view__item__head-wrap {
    background-color: #fff;
    box-shadow: 0 1px 0 0 rgba(0, 0, 0, .1);
    font-size: 13px;
    height: 72px;
    pointer-events: none;
    position: absolute;
    width: 100%;
    z-index: 1;
}

.caledar-view__item__MMM {
    height: 25px;
    color: rgb(41, 91, 230);
    font-family: Arial, Roboto, sans-serif;
    font-size: 18px;
    line-height: 24px;
    font-weight: 500;
    padding-top: 6px;
}

.caledar-view__item__head {
    cursor: crosshair;
    height: 47px;
    justify-content: center;
    text-align: center;
    pointer-events: all;
    position: relative;
    align-items: center;
    background-color: #fff;
    display: flex;
}

.caledar-view__item__head__dd {
    color: #9aa1aa;
    display: inline-block;
    font-size: 12px;
    text-align: center;
    vertical-align: middle;
    width: 16px;
}

.caledar-view__item__roadmap {
    height: 1000px;
    padding-top: 72px;
}

.caledar-view__item__roadmap__rows__item {
    width: 60px;
    height: 47px;
    &:not(.building):hover {
        cursor: crosshair;
        padding: 6px 8px;
        &:after {
            border: 2px dashed #c5c9d0;
            content: "";
            display: block;
            background-color: transparent;
            border-radius: 8px;
            border-width: 2px;
            height: 100%;
            width: 100%;
        }
    }
    &.building {
        &:hover {
            cursor: grabbing;
        }
    }
}

.caledar-view__item__head__D {
    font-size: 12px;
    text-align: center;
    vertical-align: middle;
    align-items: center;
    display: -webkit-inline-box;
    display: -ms-inline-flexbox;
    display: inline-flex;
    justify-content: center;
    position: relative;
    width: 20px;
    z-index: 2;
    em {
        color: #3d4045;
        display: block;
        font-weight: 400;
        height: 20px;
        line-height: 20px;
        transform: translateZ(0);
        vertical-align: top;
        width: 20px;
        border-radius: 50%;
        font-family: Inter-UI-Medium, Arial, Roboto, sans-serif;
        font-size: 12px;
        font-style: normal;
        &:before {
            border: 1.5px solid #ccc;
            border-radius: 50%;
            content: "";
            height: 24px;
            left: -2px;
            opacity: 0;
            position: absolute;
            top: -2px;
            width: 24px;
        }
    }
}

.roadmap__timeline {
    padding: 6px 8px;
    z-index: 1;
    position: absolute;
    height: 47px;
    &.building{
         transition: width .2s ease;
    }
   
}

.roadmap__timeline__bd {
    height: 36px;
    line-height: 36px;
    border-radius: 8px;
}

.roadmap__timeline__bd.building {
    text-align: right;
    padding-right: 8px;
    border: 2px dashed #c5c9d0;
    &:hover {
        cursor: grabbing;
    }
}

.roadmap__timeline__bd.finish {
    cursor: pointer;
    box-shadow: rgb(195,199,204,0.5) 0px 2px 6px 0px;
    overflow: hidden;
    padding: 0 0 0 8px;
    transition: box-shadow .2s ease-in-out;
    &:hover{
        .roadmap__timeline__bd__btn-remove{
            display: block;
        }
        box-shadow: rgb(195,199,204,0.5) 0px 2px 6px 0px, rgb(140,148,157) 0px 0px 0px 2px;
    }
}
.draft-roadmap-time-line-dialog{
    .el-dialog__header{
        display:none;
    }
    input{
            border: none;
            font-size: 22px;
    }
}
.roadmap__timeline__bd__btn-remove{
    display: none;
    color: red;
    position: absolute;
    top: 16px;
    right: 20px;
}

</style>
