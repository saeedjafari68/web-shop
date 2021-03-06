import React, { Component } from 'react';
import axios from 'axios'
import { BrowserRouter, Route, withRouter, Redirect } from 'react-router-dom'
import Dashboard from './Dashboard.js'
import './Dashboard.css'
import ReactTable from "react-table";
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import Server from './../Server.js'
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { Button } from 'reactstrap';
import { Panel } from 'primereact/panel';
import { connect } from 'react-redux';
import { Checkbox } from 'primereact/checkbox';
import { Loader } from 'rsuite';
import { Alert } from 'rsuite';
import Cities from './../Cities.js'
import { Fieldset } from 'primereact/fieldset';
import { MultiSelect } from 'primereact/multiselect';

class ShopInformation extends React.Component {
  constructor(props) {
    super(props);
    this.Server = new Server();
    this.state = {
      name: null,
      dashList: (this.props && this.props.location && this.props.location.state && this.props.location.state.list) ? this.props.location.state.list : [],
      dashData: (this.props && this.props.location && this.props.location.state && this.props.location.state.data) ? this.props.location.state.data : [],
      NewFactors: (this.props && this.props.location && this.props.location.state && this.props.location.state.NewFactors) ? this.props.location.state.NewFactors : null,
      NewUsers: (this.props && this.props.location && this.props.location.state && this.props.location.state.NewUsers) ? this.props.location.state.NewUsers : null,
      address: null,
      call: null,
      about: null,
      user_id: null,
      ShopId: null,
      boxAcc: null,
      bankAcc: null,
      laon: true,
      cash: true,
      Message: null,
      pic1: '',
      currentImage: '',
      SubCities: [],
      SelectedSubCities: [],
      loading: 0,
      absoluteUrl: this.Server.getAbsoluteUrl(),
      url: this.Server.getUrl(1)
    }
    this.getShopInformation();

    this.FileUpload = this.FileUpload.bind(this);

    this.EditShopInformation = this.EditShopInformation.bind(this);

  }

  FileUpload(e) {
    e.preventDefault();
    const formData = new FormData();
    let name = e.target.name;
    if (name == "logoCopyRight")
      formData.append('logoCopyRight', "1");

    formData.append('myImage', e.target.files[0]);
    if (this.state.ShopId) {
      formData.append('ShopId', this.state.ShopId);
    }
    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    };
    axios.post(this.state.url + 'uploadFile', formData, config)
      .then((response) => {
        if (name == "file")
          this.setState({
            logo: this.state.absoluteUrl + response.data.split("public")[1]
          })
        if (name == "logoCopyRight")
          this.setState({
            logoCopyRight: this.state.absoluteUrl + response.data.split("public")[1]
          })


      })
      .catch((error) => {
        console.log(error);
      });
  }
  getShopInformation() {
    let that = this;
    let param = {
      token: localStorage.getItem("api_token")
    };
    that.setState({
      loading: 1
    })
    let SCallBack = function (response1) {
      that.setState({
        loading: 0
      })
      that.setState({
        user_id: response1.data.authData.userId,
        ShopId: response1.data.authData.shopId
      })
      that.setState({
        loading: 1
      })
      that.Server.send("AdminApi/ShopInformation", { ShopId: that.state.ShopId }, function (response) {
        that.setState({
          loading: 0
        })
        that.setState({
          ShopId: that.state.ShopId,
          address: response.data.result[0].address,
          SelectedCity: response.data.result[0].city,
          SelectedSubCity: response.data.result[0].subCity,
          SendToCity: response.data.result[0].SendToCity,
          SendToNearCity: response.data.result[0].SendToNearCity,
          SendToState: response.data.result[0].SendToState,
          SendToCountry: response.data.result[0].SendToCountry,
          FreeInExpensive: response.data.result[0].FreeInExpensive,
          SelectedSubCities: response.data.result[0].SelectedSubCities,
          call: response.data.result[0].call,
          about: response.data.result[0].about,
          user_id: response.data.result[0].UserId,
          name: response.data.result[0].name,
          bankAcc: response.data.result[0].bankAcc,
          boxAcc: response.data.result[0].boxAcc,
          cash: response.data.result[0].cash,
          laon: response.data.result[0].laon,
          main: response.data.result[0].main,
          AllowCredit: response.data.result[0].AllowCredit,
          CreditCommission: response.data.result[0].CreditCommission,
          logo: response.data.result[0].logo ? that.state.absoluteUrl + response.data.result[0].logo.split("public")[1] : "http://www.youdial.in/ydlogo/nologo.png",
          logoCopyRight: response.data.result[0].logoCopyRight ? that.state.absoluteUrl + response.data.result[0].logoCopyRight.split("public")[1] : "http://www.youdial.in/ydlogo/nologo.png"

        })
      }, function (error) {
        that.setState({
          loading: 0
        })
        console.log(error)
      })

    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
      console.log(error)
    }
    this.Server.send("MainApi/checktoken", param, SCallBack, ECallBack)
  }
  getResponse(value) {
    if (this.state.SelectedCity != value.SelectedCity) {
      this.setState({
        SelectedSubCities: []
      })
    }
    this.setState({
      SelectedCity: value.SelectedCity,
      SelectedSubCity: value.SelectedSubCity
    })
    if (value.SubCities && value.SubCities.length > 0) {
      let SubCities = [];
      for (let item of value.SubCities) {
        SubCities.push({ label: item, value: item })
      }
      SubCities.shift();
      this.setState({
        SubCities: SubCities
      })

    }
  }
  EditShopInformation() {
    let that = this;
    let param = {
      token: localStorage.getItem("api_token"),
      address: this.state.address,
      city: this.state.SelectedCity,
      subCity: this.state.SelectedSubCity,
      SendToCity: this.state.SendToCity,
      SendToNearCity: this.state.SendToNearCity,
      SendToState: this.state.SendToState,
      SendToCountry: this.state.SendToCountry,
      FreeInExpensive: this.state.FreeInExpensive,
      SelectedSubCities: this.state.SelectedSubCities,
      call: this.state.call,
      about: this.state.about,
      ShopId: this.state.ShopId,
      name: this.state.name,
      boxAcc: this.state.boxAcc,
      bankAcc: this.state.bankAcc,
      cash: this.state.cash,
      laon: this.state.laon,
      AllowCredit: this.state.AllowCredit,
      CreditCommission: this.state.CreditCommission,
      edit: "1"
    };
    that.setState({
      loading: 1
    })
    let SCallBack = function (response) {
      that.setState({
        loading: 0
      })
      Alert.success('عملیات با موفقیت انجام شد', 5000);
    };
    let ECallBack = function (error) {
      that.setState({
        loading: 0
      })
      Alert.error('عملیات انجام نشد', 5000);
    }
    this.Server.send("AdminApi/ShopInformation", param, SCallBack, ECallBack)
  }



  render() {

    return (
      <div style={{ direction: 'rtl' }}>
        {this.state.loading == 1 &&
          <div style={{ position: 'fixed', zIndex: 2000, top: 10, left: 15, backgroundColor: '#e89f31', padding: '2px 20px' }}>
            <Loader content="لطفا صبر کنید ..." className="yekan" />
          </div>
        }
        <div className="row justify-content-center">

          <div className="col-12" style={{ marginTop: 20, background: '#fff' }}>
            <Panel header="ویرایش اطلاعات شخصی" style={{ marginTop: 20, textAlign: 'right', marginBottom: 50, fontFamily: 'yekan' }}>
              <form  >
                <div className="row">

                  <div className="col-lg-7">
                    <div className="group">
                      <input className="form-control yekan" autoComplete="off" type="text" value={this.state.name} name="name" onChange={(event) => this.setState({ name: event.target.value })} required="true" />
                      <label className="yekan">نام فروشگاه</label>
                    </div>
                  </div>
                  <div className="col-lg-7">
                    <div className="group">

                      <Cities callback={this.getResponse.bind(this)} callback={this.getResponse.bind(this)} SelectedCity={this.state.SelectedCity} SelectedSubCity={this.state.SelectedSubCity} />


                    </div>
                  </div>

                  <div className="col-lg-7">
                    <div className="group">

                      <textarea className="form-control yekan" autoComplete="off" type="text" value={this.state.address} name="address" onChange={(event) => this.setState({ address: event.target.value })} required="true" />
                      <label className="yekan">آدرس فروشگاه</label>

                    </div>
                  </div>
                  <div className="col-lg-7">
                    <div className="group">

                      <textarea className="form-control yekan" autoComplete="off" type="text" value={this.state.call} name="call" onChange={(event) => this.setState({ call: event.target.value })} required="true" />
                      <label className="yekan">اطلاعات تماس فروشگاه</label>

                    </div>
                  </div>
                  <div className="col-lg-7">
                    <div className="group">

                      <textarea className="form-control yekan" autoComplete="off" type="text" value={this.state.about} name="about" onChange={(event) => this.setState({ about: event.target.value })} required="true" />
                      <label className="yekan">درباره فروشگاه</label>

                    </div>
                  </div>
                  <div className="col-lg-7">
                    <div style={{ paddingRight: 8, textAlign: 'right' }} >
                      <Checkbox inputId="AllowCredit" value={this.state.AllowCredit} checked={this.state.AllowCredit} onChange={e => this.setState({ AllowCredit: e.checked })}></Checkbox>
                      <label className="yekan" style={{ paddingRight: 5, marginBottom: 0 }}>به بخش فروش اقساطی متصل است</label>
                    </div>
                  </div>
                  {this.state.AllowCredit &&
                    <div className="col-lg-7">
                      <div className="group">

                        <input className="form-control yekan" autoComplete="off" type="text" value={this.state.CreditCommission} name="CreditCommission" onChange={(event) => this.setState({ CreditCommission: event.target.value })} required="true" />
                        <label className="yekan">کارمزد فروش اقساطی</label>

                      </div>
                    </div>
                  }
                  <div className="col-lg-6" style={{ display: 'none' }}>
                    <div style={{ paddingRight: 8 }}>

                      <Checkbox inputId="laon" value={this.state.laon} checked={this.state.laon} onChange={e => this.setState({ laon: e.checked })}></Checkbox>
                      <label htmlFor="laon" className="p-checkbox-label" style={{ paddingRight: 5 }}>فروش اقساطی</label>
                      <Checkbox inputId="cash" value={this.state.cash} checked={this.state.cash} onChange={e => this.setState({ cash: e.checked })} style={{ paddingRight: 10 }}></Checkbox>
                      <label htmlFor="cash" className="p-checkbox-label" style={{ paddingRight: 15 }}>فروش نقدی</label>
                    </div>
                  </div>

                  <div className="col-lg-12" style={{ marginTop: 20, display: 'none' }}>
                    <div style={{ paddingRight: 10 }}>

                      <p className="yekan">
                        شماره حساب های زیر جهت انجام تسویه حساب دوره ای استفاده می شود
                      </p>
                      <p className="yekan">
                        تسویه حساب با فروشندگان در روز پایانی هفته انجام می شود
                      </p>
                    </div>
                  </div>

                  <div className="col-lg-6" style={{ display: 'none' }}>
                    <div className="group">

                      <input className="form-control yekan" autoComplete="off" type="text" value={this.state.boxAcc} name="boxAcc" onChange={(event) => this.setState({ boxAcc: event.target.value })} required="true" />
                      <label className="yekan">شماره حساب صندوق انصارالحسین خورزوق</label>

                    </div>
                  </div>
                  <div className="col-lg-6" style={{ display: 'none' }}>
                    <div className="group">

                      <input className="form-control yekan" autoComplete="off" type="text" value={this.state.bankAcc} name="bankAcc" onChange={(event) => this.setState({ bankAcc: event.target.value })} required="true" />
                      <label className="yekan">شماره حساب بانک</label>

                    </div>
                  </div>
                  <div className="col-6" style={{ marginTop: 20 }} >
                    <div className="group">
                      <input className="form-control yekan" autoComplete="off" onChange={this.FileUpload} type="file" name="file" />
                      <label>آپلود لوگو</label>
                    </div>
                  </div>
                  <div className="col-6" style={{ marginTop: 20 }}>
                    <img src={this.state.logo} style={{ width: 150, height: 150 }} />
                  </div>
                  {this.state.main &&
                    <div className="col-6" style={{ marginTop: 20 }} >
                      <div className="group">
                        <input className="form-control yekan" autoComplete="off" onChange={this.FileUpload} type="file" name="logoCopyRight" />
                        <label> آپلود لوگو کپی رایت</label>
                      </div>
                    </div>
                  }
                  {this.state.main &&
                    <div className="col-6" style={{ marginTop: 20 }}>
                      <img src={this.state.logoCopyRight} style={{ width: 150, height: 150 }} />
                    </div>
                  }

                  <div className="col-12" style={{ marginTop: 20 }}>

                    <Fieldset legend="تنظیمات ارسال کالا" style={{ marginTop: 20, textAlign: 'right', marginBottom: 50, fontFamily: 'yekan' }}>
                      <div className="row">
                        <div className="col-lg-3 col-12" style={{ display: 'flex', alignItems: 'center' }}>
                          <Checkbox onChange={e => this.setState({ SendToCity: e.checked })} checked={this.state.SendToCity}></Checkbox>
                          <label style={{ paddingRight: 5, marginTop: 5 }}>ارسال درون شهری</label>
                        </div>
                        <div className="col-lg-3 col-12" style={{ display: 'flex', alignItems: 'center' }}>
                          <Checkbox onChange={e => this.setState({ SendToNearCity: e.checked })} checked={this.state.SendToNearCity}></Checkbox>
                          <label style={{ paddingRight: 5, marginTop: 5 }}>ارسال به شهرهای مجاور</label>
                        </div>
                        <div className="col-lg-3 col-12" style={{ display: 'flex', alignItems: 'center' }}>
                          <Checkbox onChange={e => this.setState({ SendToState: e.checked })} checked={this.state.SendToState}></Checkbox>
                          <label style={{ paddingRight: 5, marginTop: 5 }}>ارسال درون استانی</label>
                        </div>
                        <div className="col-lg-3 col-12" style={{ display: 'flex', alignItems: 'center' }}>
                          <Checkbox onChange={e => this.setState({ SendToCountry: e.checked })} checked={this.state.SendToCountry}></Checkbox>
                          <label style={{ paddingRight: 5, marginTop: 5 }}>ارسال سزاسری</label>
                        </div>
                        {this.state.SendToNearCity &&
                          <div class="col-12" style={{ marginTop: 20, marginBottom: 20 }}>
                            <p className="yekan">
                              شهرهای مجاور شهر خود را انتخاب کنید
                            </p>
                            <MultiSelect optionLabel="label" style={{ width: '100%' }} value={this.state.SelectedSubCities} options={this.state.SubCities} onChange={(e) => this.setState({ SelectedSubCities: e.value })} />

                          </div>
                        }

                        <div className="col-lg-12 col-12" style={{ display: 'flex', alignItems: 'center' }}>
                          <Checkbox onChange={e => this.setState({ FreeInExpensive: e.checked })} checked={this.state.FreeInExpensive}></Checkbox>
                          <label style={{ paddingRight: 5, marginTop: 5 }}>برای خریدهای با مبلغ زیاد هزینه پیک رایگان شود</label>
                        </div>

                      </div>
                    </Fieldset>
                  </div>

                  <div className="col-lg-12">
                    <Button style={{ marginLeft: 5, marginTop: 10 }} color="primary" onClick={this.EditShopInformation}>ویرایش اطلاعات</Button>
                  </div>

                  <div className="col-lg-12" style={{ marginTop: 10 }}>
                    {
                      this.state.Message &&
                      <Alert color={this.state.Message.type} style={{ textAlign: "center", fontSize: 18 }} className="yekan">
                        {this.state.Message.text}
                      </Alert>
                    }

                  </div>

                </div>

              </form>
            </Panel>


          </div>

        </div>

      </div>

    )
  }
}
const mapStateToProps = (state) => {
  return {
    username: state.username
  }
}
export default withRouter(
  connect(mapStateToProps)(ShopInformation)
);
