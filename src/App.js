import socket from "./utilities/socketConnection";
import {Component} from "react";
import Widget from "./components/Widget";
import {Divider, Stack, Switch, Text} from "@chakra-ui/react";

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            performanceData: {},
            showOffline: false
        }
    }

    componentDidMount() {
        socket.emit('clientAuth', 'asdfasd')

        socket.on('data', (data) => {
            // inside this callback we just gome some new data!
            // lets update state so we can re-render app --> widget --> cpu
            // we need to make a copy of current state
            // so we can mutate it!
            const currentState = ({...this.state.performanceData})
            // const currentState = Object.assign(this.state.performanceData)
            // currentState is an object! Not an array!
            // the reason for this is so we can use the machines
            // macA as it's property
            // console.log(data)
            currentState[data.macA] = data
            this.setState({
                performanceData: currentState
            })
        })

        socket.on('error', (data) => {
            console.log(data)
        })

        socket.on('reconnect', (data) => {
            socket.emit('clientAuth', 'asdfasd')
        })
    }

    render() {

        // console.log(this.state.performanceData)

        let widgets = []
        const data = this.state.performanceData

        // grab each machine, by property, from data
        Object
            .entries(data)
            .sort((a, b) => {
                return a > b ? -1 : a < b ? 1 : 0
            })
            .filter(([key, value]) => {
                return this.state.showOffline || value.isActive
            })
            .forEach(([key, value]) => {
                widgets.push(<Divider key={key + '_divider'} orientation="horizontal" />)
                widgets.push(<Widget key={key} data={value}/>)
            })

        return (
            <Stack align={'center'} paddingY={20} spacing={20}>
                <Stack direction="row" marginTop={0} align={'center'} spacing={20}>
                    <Text fontSize="4xl">Performance data from personal machines</Text>
                    <Stack direction={'column'} align={'center'}>
                        <Text fontSize="2xl">
                            Show offline machines?
                        </Text>
                        <Switch id="filter-offline" size="lg" onChange={() => {
                            console.log(this.state.showOffline)
                            this.setState({
                                showOffline: !this.state.showOffline
                            })
                        }} value={this.state.showOffline}/>
                    </Stack>
                </Stack>
                {widgets}
            </Stack>
        )
    };
}

export default App;
