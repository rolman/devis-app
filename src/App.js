import React, {Component} from 'react';
import axios from 'axios';
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            locations: [],
            sections: [],
            deal: [],
            billingAddress: [],
            company: [],
            data: [],
            isRoomView: false
        };

        this.switchViewClick = this.switchViewClick.bind(this);
    }

    componentDidMount() {
        fetch('http://localhost:4000/data').then(res => {
            return res.json();
        })
            .then(res2 => {
                this.setState({locations: res2.locations});
                this.setState({sections: res2.sections});
                this.setState({deal: res2.deal});
                this.setState({billingAddress: res2.deal.billingAddress});
                this.setState({company: res2.company});
                this.setState({data: res2});
            })
            .catch(error => console.log(error))
    }

    switchViewClick() {
        this.setState(state => ({
            isRoomView: !state.isRoomView
        }));
    }

    display() {
        if (this.state.isRoomView) {
            return this.displayByRoom()
        } else {
            return this.displayByLabel()
        }
    }

    displayByLabel() {
        return <div>
            {
                this.state.sections.map((section) =>
                    <div>
                        {section.lots.map((lot) =>
                            <div className="devisElem">
                                <h2>{lot.label}</h2>
                                <tr>
                                    <th width="600px">Designation</th>
                                    <th width="100px">Prix HT</th>
                                    <th width="100px">Prix TTC</th>
                                </tr>
                                {
                                    this.sortByLabel(section.lots, lot.label)
                                }
                            </div>)}
                    </div>)
            }
        </div>
    }

    displayByRoom() {
        return <div>
            {
                this.state.locations.map((value) =>
                    <div className="devisElem">
                        <h2>{value.label}</h2>
                        <tr>
                            <th width="600px">Designation</th>
                            <th width="100px">Prix HT</th>
                            <th width="100px">Prix TTC</th>
                        </tr>
                        {this.state.sections.map((section) =>
                            <div>{
                                section.lots.map((lot) =>
                                    lot.lignes.map((ligne) =>
                                        <div>{this.sortByLocation(ligne, value.uuid)}</div>
                                    )
                                )
                            }</div>
                        )}
                    </div>
                )
            }
            <div className="devisElem">
                <h1>Autres prestations</h1>
                {
                    this.state.sections.map((section) =>
                        <div>
                            {section.lots.map((lot) =>
                                lot.lignes.map((ligne) =>
                                    <div>{this.sortByLocation(ligne, "")}</div>
                                )
                            )}
                        </div>
                    )
                }
            </div>
        </div>
    }

    elementDisplay(ligne) {
        return <div>
            <tr>
                <td width="600px">
                    {ligne.designation}
                </td>
                <td width="100px">
                    {ligne.prixHT}
                </td>
                <td width="100px">
                    {ligne.prixTTC}
                </td>
            </tr>
        </div>
    }

    sortByLocation(ligne, location) {
        if (location === "" && ligne.locationsDetails.locations.length === 0) {
            return this.elementDisplay(ligne)
        }
        return ligne.locationsDetails.locations.filter(v => v.uuid === (location)).map(() => this.elementDisplay(ligne))
    }

    sortByLabel(lots, label) {
        return lots.filter(v => v.label === (label)).map(lot => lot.lignes.map(ligne => this.elementDisplay(ligne)))
    }


    headerDisplay(){
        return <div >
            <h1 className="headerTitle">Devis {this.state.company.name}</h1>
            <div className="logo">
                <img src={this.state.company.logoUrl}  alt="Italian Trulli"/>
            </div>
            <div>
                Client
                <br/>
                {this.state.deal.customerName}
                <br/>
                {this.state.deal.customerEmail}
                <br/>
                {this.state.billingAddress.address}
                <br/>
                {this.state.billingAddress.postalCode}
                <br/>
                {this.state.billingAddress.city}
            </div>
        </div>
    }

    footerDisplay(){
        return <div className="devisElem">
            <h2> Total devis</h2>
            Total HT : {this.state.data.prixTotalHT} €
            <br/>
            Total TTC : {this.state.data.prixTotalTTC} €
        </div>
    }

    render() {
        return (
            <div>
                {this.headerDisplay()}
                <button onClick={this.switchViewClick} className="button"> Voir la
                    vue {this.state.isRoomView ? "par label" : "par pièce"} </button>
                {
                    this.display()
                }
                {this.footerDisplay()}
            </div>
        )
    }
}

export default App;

