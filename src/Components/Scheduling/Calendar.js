import React, { Component } from 'react'
import { ScheduleComponent, Day, Week, WorkWeek, Month, Inject, ViewsDirective, ViewDirective } from '@syncfusion/ej2-react-schedule';

export default class Calendar extends Component {
    constructor() {
        super(...arguments)
        this.state = {
            
        }
    }
    onPopupOpen(args) {
        if (args.type === 'Editor') {
            args.duration = 60;
        }
    }
    click = () => {
        console.log(this.scheduleObj)
        console.log(this.scheduleObj.data)
    }
    render() {
        return (
            <>
                <button onClick={this.click}>Click</button>
                <ScheduleComponent ref={t => this.scheduleObj = t} popupOpen={this.onPopupOpen.bind(this)} width='100%' height='550px' selectedDate={new Date(2018, 1, 15)} eventSettings={{ dataSource: this.scheduleData }}>
                    <ViewsDirective>
                        <ViewDirective option='Day'/>
                        <ViewDirective option='Week'/>
                        <ViewDirective option='WorkWeek'/>
                        <ViewDirective option='Month'/>
                    </ViewsDirective>
                    <Inject services={[Day, Week, WorkWeek, Month]}/>
                </ScheduleComponent>
                
            </>
        )
    }
}
