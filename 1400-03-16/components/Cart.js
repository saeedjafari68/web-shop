import React, { Component } from 'react';
import Server from './Server.js'
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import axios from 'axios'
import { connect } from 'react-redux';
import { BrowserRouter, Route, withRouter, Redirect } from 'react-router-dom'
import Header1 from './Header1.js'
import LoadingOverlay from 'react-loading-overlay';
import { Link } from 'react-router-dom'
import { Steps, Notification } from 'rsuite';
import 'rsuite/dist/styles/rsuite-default.css';
import MainBox3 from './MainBox3.js'
import Footer from './Footer.js'
import Header2 from './Header2.js'
import { Alert, Message } from 'rsuite';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import './Cart.css'
import CatList from './CatList.js'
import { InputNumber } from 'primereact/inputnumber';
import DatePicker from 'react-datepicker2';

import { RadioButton } from 'primereact/radiobutton';
import { Toast } from 'primereact/toast';
import { Sidebar } from 'primereact/sidebar';

class Cart extends React.Component {
    constructor(props) {
        super(props);
        //alert(1)
        this.itemTemplate = this.itemTemplate.bind(this);
        this.Payment = this.Payment.bind(this);
        this.computeReduce = this.computeReduce.bind(this);
        this.Server = new Server();
        this.toast = React.createRef();
        this.FileUpload = this.FileUpload.bind(this);

        this.state = {
            GridData: [],
            layout: 'list',
            lastPrice: 0,
            CartItemsGet: 0,
            CartNumber: 0,
            userId: null,
            loading:1,
            pleaseWait: false,
            AcceptAddress: false,
            StepNumber: 1,
            Address: "",
            StepVertical: 0,
            refId: null,
            EndMessage: "",
            ActiveBank: "none",
            ActiveSms: "none",
            PriceAfterCompute: 0,
            finalCreditReducer: 0,
            TypeOfPayment: '1',
            info: this.Server.getInfo(),
            absoluteUrl: this.Server.getAbsoluteUrl(),
            url: this.Server.getUrl()
        }


    }
    debounce(func, wait, immediate) {
        var timeout;
        return function () {
            var context = this, args = arguments;
            var later = function () {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }
    FileUpload(e) {
        e.preventDefault();
        const formData = new FormData();
        let name = e.target.name;
        debugger;
        formData.append('myImage', e.target.files[0]);
        formData.append('ExtraFile', 1);
        
        const config = {
          headers: {
            'content-type': 'multipart/form-data'
          },
          onUploadProgress: (progressEvent) => {
            const { loaded, total } = progressEvent;
            let percent = parseInt((loaded * 100) / total)
            this.setState({
              showLoadedCount: 1,
              loadedCount: `${loaded} byte of ${total}byte | ${percent}%`
            })
            if (percent == "100") {
              this.setState({
                showLoadedCount: 0
              })
            }
    
          }
        };
        axios.post(this.state.url + 'uploadFile', formData, config)
          .then((response) => {
            this.setState({
                ["InChequeImg_" + name.split("_")[1]]: this.state.absoluteUrl + response.data.split("public")[1]

              })
          })
          .catch((error) => {
            console.log(error);
          });
      }
    roundPrice(price) {
        return price.toString();
        if (price == 0)
            return price;
        price = parseInt(price).toString();
        let C = "500";
        let S = 3;
        if (price.length <= 5) {
            C = "100";
            S = 2;
        }
        if (price.length <= 4) {
            C = "100";
            S = 2;
        }
        let A = price.substr(price.length - S, S)
        if (A == C || A == "000" || A == "00")
            return price;
        if (parseInt(A) > parseInt(C)) {
            let B = parseInt(A) - parseInt(C);
            return (parseInt(price) - B + parseInt(C)).toString();
        } else {
            let B = parseInt(C) - parseInt(A);
            return (parseInt(price) + B).toString();
        }


    }
    Payment() {
        let that = this;
        
        if (!this.state.AcceptAddress) {
            axios.post(this.state.url + 'getuserInformation', {
                user_id: this.state.userId
            })
                .then(response => {
                    that.setState({
                        Address: response.data.result[0].address,
                        AcceptAddress: true,
                        StepNumber: 2
                    })
                }).catch(error => {
                    console.log(error)
                })
            return;
        } else {
                if (this.state.lastPrice != 0) {
                    let user_id = this.state.GridData[0].user_id;
                    let products_id = [];
                    for (let i = 0; i < this.state.GridData.length; i++) {
                        if (this.state.GridData[i].products[0])
                            products_id.push({ _id: this.state.GridData[i].product_id, SellerId: ((this.state.GridData[i].product_detail && this.state.GridData[i].product_detail[0]) ? this.state.GridData[i].product_detail[0].SellerId : this.state.GridData[i].products[0].SellerId), SellerName: ((this.state.GridData[i].Seller && this.state.GridData[i].Seller[0]) ? this.state.GridData[i].Seller[0].name : "")
                            , SellerAddress: ((this.state.GridData[i].Seller && this.state.GridData[i].Seller[0]) ? this.state.GridData[i].Seller[0].address : ""), SellerLat: ((this.state.GridData[i].Seller && this.state.GridData[i].Seller[0]) ? this.state.GridData[i].Seller[0].latitude : ""), SellerLon: ((this.state.GridData[i].Seller && this.state.GridData[i].Seller[0]) ? this.state.GridData[i].Seller[0].longitude : "")
                            , SellerMobile: ((this.state.GridData[i].Seller && this.state.GridData[i].Seller[0]) ? this.state.GridData[i].Seller[0].mobile : ""), number: this.state.GridData[i].number, CatId: this.state.GridData[i].products[0].category_id, title: this.state.GridData[i].products[0].title, subTitle: this.state.GridData[i].products[0].subTitle, desc: this.state.GridData[i].products[0].desc, price: (this.roundPrice(this.state.GridData[i].number * this.state.GridData[i].price)), UnitPrice: this.state.GridData[i].price, credit: this.state.GridData[i].getFromCredit, SellerId: this.state.GridData[i].products[0].SellerId, fileUploaded: this.state.GridData[i].products[0].fileUploaded, status: "0", color: this.state.GridData[i].Color, size: this.state.GridData[i].Size });
                    }
                    that.setState({
                        StepNumber: 3
                    })
    
                    let url = that.state.ActiveBank == "z" ? this.state.url + 'payment' : this.state.url + 'payment2';
                    let param = {
                        paykAmount: this.state.paykAmount,
                        Amount: parseInt(this.state.lastPrice),
                        finalAmount: parseInt(this.state.lastPrice) + parseInt(this.state.paykAmount),
                        Credit: this.state.finalCreditReducer,
                        userId: this.state.userId,
                        products_id: products_id,
                        SaleFromMultiShops:this.state.SaleFromMultiShops,
                        SeveralShop:this.state.SeveralShop,
                        needPay: (that.state.ActiveBank == "none" || that.state.ActiveBank == "inPlace" || that.state.ActiveBank == "Cheque") ? 0 : 1
                    }

                    if(this.state.ActiveBank == "Cheque"){
                        param["ChequeList"]=[]
                        for(let m=0;m<parseInt(this.state.ChequeInfo.MaxCheque);m++){
                            param["ChequeList"].push({})
                        }
                        for (let state in this.state) {
                            if (state.indexOf("InCheque") > -1 ) {
                                if(state.indexOf("InChequeDate_") > -1)
                                    param["ChequeList"][parseInt(state.split("_")[1])][state.split("_")[0]] = this.state[state]?.local("fa").format("jYYYY/jM/jD")
                                else
                                    param["ChequeList"][parseInt(state.split("_")[1])][state.split("_")[0]] = this.state[state]?.toString().replace(/,/g, "");
                            }
                        }
                    }
                    
                    axios.post(url, param)
                        .then(response => {
                            if (that.state.ActiveBank != "none" && that.state.ActiveBank != "inPlace" && that.state.ActiveBank != "Cheque") {
                                let res;
                                if (that.state.ActiveBank == "p") {
                                    res = response.data.result ? response.data.result.SalePaymentRequestResult : {};
                                    if (res.Token > 0 && res.Status == "0") {
                                        window.location = "https://pec.shaparak.ir/NewIPG/?token=" + res.Token;
                                    } else {
                                        this.toast.current.show({ severity: 'error', summary: <div> {res.Message} <br />برای اتمام خرید می توانید در زمان دیگری مراجعه کنید یا از امکان پرداخت در محل استفاده کنید</div>, life: 8000 });
                                    }
                                } else if (that.state.ActiveBank == "z") {
                                    res = response.data.result;
                                    window.location = res;
                                }
                            } else {
                                that.props.dispatch({
                                    type: 'LoginTrueUser',
                                    CartNumber: 0,
                                    off: that.props.off,
                                    credit: response.data.credit

                                })
                                that.setState({
                                    GridData: [],
                                    refId: response.data.refId,
                                    EndMessage: <div className="YekanBakhFaMedium"> کد رهگیری سفارش : {that.persianNumber(response.data.refId)} <br /><br /><p className="YekanBakhFaMedium" style={{ fontSize: 25 }}>سفارش شما ثبت شد <br /> </p> </div>
    
                                })
                                if (this.state.ActiveSms != "none") {
                                    let SmsUrl = this.state.ActiveSms == "smsir" ? this.state.url + 'sendsms_SmsIr' : this.state.url + 'sendsms_smartSms';
                                    axios.post(SmsUrl, {
                                        text: 'سفارش شما ثبت شد . کد رهگیری سفارش : ' + that.persianNumber(response.data.refId) + '' + '\n' + that.state.STitle,
                                        mobileNo: response.data.result
                                    })
                                        .then(response => {
    
    
                                        })
                                        .catch(error => {
    
                                        })
                                }
    
    
                            }
    
                        }).catch(error => {
                            console.log(error)
                        })
                } else {
    
                }
            


        }

    }
    componentDidMount() {
        let that = this;
        axios.post(this.state.url + 'checktoken', {
            token: localStorage.getItem("api_token")
        })
            .then(response => {
                this.setState({
                    userId: response.data.authData.userId,
                    levelOfUser: response.data.authData.levelOfUser,
                    credit:response.data.authData.credit
                })

                axios.post(this.state.url + 'getSettings', {
                    token: localStorage.getItem("api_token")
                })
                    .then(response => {
                        that.setState({
                            ActiveBank: response.data.result ? response.data.result.ActiveBank : "none",
                            OriginalActiveBank: response.data.result ? response.data.result.OriginalActiveBank : "none",
                            SaleByCheque: response.data.result ? response.data.result.SaleByCheque : false,
                            ChequeInfo: response.data.result ? response.data.result.ChequeInfo : {},
                            ActiveSms: response.data.result ? response.data.result.ActiveSms : "none",
                            STitle: response.data.result ? response.data.result.STitle : "",
                            ProductBase: response.data.result ? response.data.result.ProductBase : false,
                            SaleFromMultiShops: response.data.result ? response.data.result.SaleFromMultiShops : false,
                            SeveralShop: response.data.result ? response.data.result.SeveralShop : false,
                            InRaymand:response.data.result ? response.data.result.Raymand : false,
                            credit:response.data.result.Raymand ? that.state.credit.toString().substr(0,that.state.credit.toString().length-1) : that.state.credit


                        })
                        that.getPics();
                    })
                    .catch(error => {
                        console.log(error)
                    })
            })
            .catch(error => {
                console.log(error)
            })
    }
    getPics(l, type) {
        let that = this;
        axios.post(this.state.url + 'getPics', {})
          .then(response => {
            response.data.result.map(function (item, index) {
              
              if (item.name == "file13"){
                that.setState({
                  loading_pic: that.state.absoluteUrl +  item?.fileUploaded?.split("public")[1],
                })
              }
                  
            })
            this.getCartItems();
        })
          .catch(error => {
            this.getCartItems();
        })
    
    }
    getCartItems() {
        let that = this;
        this.setState({
            lastPrice: 0,
            orgLastPrice: 0,
            paykAmount: 0
        })
        let param = {
            UId: this.state.userId,
            levelOfUser: this.state.levelOfUser/*,
            token: localStorage.getItem("api_token_admin"),*/

        };
        let SCallBack = function (response) {
            let lastPrice = 0,
                CartNumber = 0;
            let paykAmount = [],
                LastPaykAmount = 0,
                PrepareTime = [],
                forceChangeItem = [];
            response.data.result.map((res) => {
                
                if (res.price)
                    lastPrice += res.number * parseInt(that.roundPrice(res.price));
                PrepareTime.push(that.state.ProductBase ? res.products[0].PrepareTime : (res.Seller[0].PreparTime || "30"));
                CartNumber += parseInt(res.number);
                if(res.PeykInfo && res.PeykInfo.length > 0 ){
                    if(res.Category && res.Category.length > 0){
                        res.PeykInfo[1].SendToCity = res.Category[0].SendToCity;
                        res.PeykInfo[1].SendToCountry = res.Category[0].SendToCountry;
                        res.PeykInfo[1].SendToNearCity = res.Category[0].SendToNearCity;
                        res.PeykInfo[1].SendToState = res.Category[0].SendToState;
                    }
                    switch (res.PeykInfo[2].userLocation) {
                        case 1: {
                            paykAmount.push({ Amount: parseInt(res.PeykInfo[1].SendToCity || "0") * (res.PeykInfo[1].CumputeByNumberInPeyk ? parseInt(res.number) : 1), Marge: res.PeykInfo[1].MergeableInPeyk ? 1 : 0 })
                            break;
                        }
                        case 2: {
                            paykAmount.push({ Amount: parseInt(res.PeykInfo[1].SendToNearCity || "0") * (res.PeykInfo[1].CumputeByNumberInPeyk ? parseInt(res.number) : 1), Marge: res.PeykInfo[1].MergeableInPeyk ? 1 : 0 })
                            break;
                        }
                        case 3: {
                            paykAmount.push({ Amount: parseInt(res.PeykInfo[1].SendToState || "0") * (res.PeykInfo[1].CumputeByNumberInPeyk ? parseInt(res.number) : 1), Marge: res.PeykInfo[1].MergeableInPeyk ? 1 : 0 })
                            break;
                        }
                        case 4: {
                            paykAmount.push({ Amount: parseInt(res.PeykInfo[1].SendToCountry || "0") * (res.PeykInfo[1].CumputeByNumberInPeyk ? parseInt(res.number) : 1), Marge: res.PeykInfo[1].MergeableInPeyk ? 1 : 0 })
                            break;
                        }
                    }
                }
                
                if (parseInt(res.products[0].price) - (((parseInt(res.products[0].price) * (( parseInt(res.products[0].off||0)))))/100) != res.price) {
                    res.price = parseInt(res.products[0].price) - (((parseInt(res.products[0].price) * (( parseInt(res.products[0].off||0)))))/100);
                    if(that.toast.current)
                        that.toast.current.show({ severity: 'warn', summary: 'اصلاح سبد خرید', detail: <div> قیمت {res.products[0].title} تغییر کرده است <br /> سبد خرید شما با قیمت جدید به روز شد </div>, life: 8000 });
                    forceChangeItem.push(res);
                }
                if (res.products[0].number == 0) {
                    res.number = '0';
                    if(that.toast.current)
                        that.toast.current.show({ severity: 'warn', summary: 'اصلاح سبد خرید', detail: <div> محصول {res.products[0].title} ناموجود شده است <br /> از سبد خرید شما حذف شد </div>, life: 8000 });
                    forceChangeItem.push(res);
                }


            })
            let MargablePaykAmount = [],
                NotMargablePaykAmount = [];
            for (let i = 0; i < paykAmount.length; i++) {
                if (paykAmount[i].Marge)
                    MargablePaykAmount.push(paykAmount[i].Amount)
                else
                    NotMargablePaykAmount.push(paykAmount[i].Amount)
            }
            LastPaykAmount += NotMargablePaykAmount.reduce((a, b) => a + b, 0);
            LastPaykAmount += MargablePaykAmount.length > 0 ? Math.max(...MargablePaykAmount) : 0;
            that.setState({
                PrepareTime: Math.max(...PrepareTime),
                paykAmount: LastPaykAmount,
                lastPrice: lastPrice,
                orgLastPrice: lastPrice,
                GridData: response.data.result,
                CartNumber: CartNumber,
                CartItemsGet: 1,
                loading:0,
                CatId: (response.data.result[0] && response.data.result[0].products && response.data.result[0].products.length > 0) ? response.data.result[0].products[0].category_id : null
            })
            that.props.dispatch({
                type: 'LoginTrueUser',
                CartNumber: that.state.CartNumber,
                off: that.props.off,
                credit: that.state.credit != "undefined" ? that.state.credit : 0
            })
            /*Notification.open({
             title: '',
             placement:'bottomStart',
             duration: 3500,
             description: (
               <div>
                 <p className="YekanBakhFaMedium">تعداد کالا ی موجود در سبد خرید <span style={{"color":"green"}}> {that.persianNumber(that.state.CartNumber)} </span> محصول</p>
               </div>
             )
           });*/
            setTimeout(function () {
                that.setState({
                    pleaseWait: false
                })
                if (forceChangeItem.length > 0)
                    that.forceChangeItems(forceChangeItem);
            }, 0)


        };
        let ECallBack = function (error) {
            that.setState({
                CartItemsGet: 1
            })
            console.log(error)
        }
        console.log(param)
        this.Server.send("MainApi/getCartPerId", param, SCallBack, ECallBack)
    }
    forceChangeItems(items) {
        if (items && items.length > 0)
            this.changeCart(items[items.length - 1].number, items[items.length - 1].product_detail_id || items[items.length - 1].product_id, items[items.length - 1].user_id, items, items[items.length - 1], 1);
        else
            this.getCartItems();
    }
    changeCart(number, product_id, user_id, items, item, forceChange) {
        let that = this;

        if (this.state.pleaseWait)
            return;
        this.setState({
            pleaseWait: true
        })
        this.debounce(
            axios.post(this.state.url + 'checktoken', {
                token: localStorage.getItem("api_token")
            })
                .then(response => {
                    let param = {
                        product_id: product_id,
                        user_id: response.data.authData.userId,
                        number: number == "0" ? "0" : number,
                        newPrice: item ? item.price : null
                    };
                    if (items)
                        items.pop();
                    let SCallBack = function (response) {
                        /*if(number == "0" && parseInt(item.getFromCredit) > 0){
                            let Comm = item.Seller[0].CreditCommission ? ((((parseInt(item.Seller[0].CreditCommission))*parseInt(item.getFromCredit))/100)): 0;
                            that.setState({
                                lastPrice:(parseInt(that.state.lastPrice) + parseInt(item.getFromCredit)) + Comm,
                                finalCreditReducer:parseInt(that.state.finalCreditReducer) - parseInt(item.getFromCredit)
                            })
                        }*/
                        //if(number=="0"){
                        that.setState({
                            lastPrice: that.state.orgLastPrice,
                            finalCreditReducer: 0
                        })
                        //}
                        that.setState({
                            pleaseWait: false
                        })
                        if (!forceChange) {
                            that.getCartItems();
                        } else {
                            that.forceChangeItems(items);
                        }

                    };
                    let ECallBack = function (error) {
                        that.setState({
                            pleaseWait: false
                        })
                        console.log(error)
                    }
                    that.Server.send("MainApi/changeCart", param, SCallBack, ECallBack)

                }).catch(error => {
                    that.setState({
                        pleaseWait: false
                    })
                    console.log(error)
                }), 1000)


    }
    itemTemplate(car, layout) {
        if (layout === 'list' && car && car.products[0]) {
            let pic = car.products[0].fileUploaded.split("public")[1] ? this.state.absoluteUrl + car.products[0].fileUploaded.split("public")[1] : this.state.absoluteUrl + 'nophoto.png';
            let rowPrice = car.price//car.products[0].getFromCredit ? car.products[0].price : (car.products[0].price - (car.products[0].price * ((!car.products[0].NoOff ? parseInt(this.props.off) : 0)+car.products[0].off))/100);

            //let pic = car.products[0].fileUploaded.split("public")[1] ? 'http://localhost:3000/'+car.products[0].fileUploaded.split("public")[1] : 'http://localhost:3000/'+'nophoto.png';
            return (
                <div style={{ marginTop: 15 }}>
                    <div className="row" style={{ alignItems: 'center' }}>

                        <div className="col-lg-3 col-md-3  col-12 YekanBakhFaMedium" style={{ textAlign: 'center' }}>
                            <Link target="_blank" to={`${process.env.PUBLIC_URL}/Products?id=` + car.product_detail_id || car.products[0]._id} >
                                <img src={pic} style={{ height: "140px" }} name="pic3" onClick={this.Changepic} alt="" />
                            </Link>
                        </div>
                        <div className="col-lg-4 col-md-6 col-12 YekanBakhFaLight" style={{ textAlign: 'right' }} >
                            <div style={{ paddingBottom: 5 }} className="YekanBakhFaBold">
                                {car.products[0].title}

                            </div>
                            {car.product_detail && car.product_detail.length > 0 &&
                                <div>
                                    <div style={{ paddingBottom: 5, fontSize: 13 }}>
                                        <i className="fal fa-umbrella" style={{ paddingLeft: 5 }}></i><span>گارانتی اصالت و سلامت فیزیکی کالا</span>
                                    </div>
                                    <div style={{ paddingBottom: 5, fontSize: 13 }}>
                                        <i className="fal fa-id-card-alt" style={{ paddingLeft: 5 }}></i><span>{car.Seller[0].name} </span>
                                    </div>
                                    <div style={{ paddingBottom: 5, fontSize: 13 }}>

                                        <i className="fal fa-rocket" style={{ paddingLeft: 5 }}></i>
                                        {this.state.ProductBase ?
                                            <span>ارسال تا {this.persianNumber(car.product_detail[0].PrepareTime || "3")} روز کاری دیگر</span>
                                            :
                                            <span>ارسال تا {this.persianNumber(car.Seller[0].PrepareTime || "30")} دقیقه بعد از پرداخت</span>

                                        }


                                    </div>
                                </div>
                            }
                            <br />
                        </div>
                        <div className="col-12 mb-3">
                            <div className="row" style={{ alignItems: 'center' }} >

                                <div className="col-lg-3 col-12 YekanBakhFaMedium mt-lg-0 mt-4" style={{ textAlign: 'center' }}>

                                </div>
                                <div className="col-lg-2 col-4 YekanBakhFaMedium" style={{ textAlign: 'center' }}>
                                    <InputNumber value={car.number} inputStyle={{ borderRadius: 0, padding: 0, textAlign: 'center', fontSize: 20 }} mode="decimal" showButtons onValueChange={(e) => { if (car.number == e.value) return; this.changeCart(e.value, car.product_detail_id || car.product_id, car.user_id) }} min={1} max={car.products[0].number} />

                                </div>
                                <div className="col-lg-2 col-12 YekanBakhFaMedium mt-lg-0 mt-4" style={{ textAlign: 'center' }}>
                                    <span style={{ cursor: 'pointer' }} onClick={(e) => this.changeCart("0", car.product_detail_id || car.product_id, car.user_id)}>
                                        <i className="fal fa-trash-alt" style={{ paddingLeft: 5 }}></i><span>حذف</span>
                                    </span>


                                </div>
                                <div className="col-lg-2 col-12 YekanBakhFaMedium mt-lg-0 mt-4" style={{ textAlign: 'center' }}>
                                    {car.Seller[0] && car.Seller[0].AllowCredit ?

                                        <div>

                                            <a className="YekanBakhFaMedium" style={{ color: 'green', cursor: 'pointer' }} href="javascript:void(0)" onClick={() => { this.setState({ displayReduse: car, ReducePrice: car.getFromCredit ? car.getFromCredit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0, PriceAfterCompute: (car.number * parseInt(rowPrice)) }); return false; }}>کسر از کیف پول</a>

                                        </div>
                                        :
                                        <div>
                                            <label className="YekanBakhFaMedium">خرید آنلاین</label>

                                        </div>
                                    }
                                </div>

                                <div className="col-lg-3 col-12 YekanBakhFaMedium mt-lg-0 mt-4" style={{ textAlign: 'left' }}>
                                    {car.products[0].price != '-' &&
                                        <div>
                                            <div style={{ fontSize: 14 }}>
                                                {this.persianNumber(this.roundPrice(car.number * (parseInt(rowPrice).toString())).replace(/\B(?=(\d{3})+(?!\d))/g, ","))} تومان
                            </div>
                                            {car.getFromCredit != undefined && car.getFromCredit != 0 &&
                                                <div style={{ fontSize: 12, color: '#777', paddingTop: 5 }}>
                                                    +{this.persianNumber(car.getFromCredit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))} تومان از کیف پول
                            </div>
                                            }
                                        </div>
                                    }
                                </div>

                            </div>
                        </div>

                    </div>


                </div>
            );
        } else {
            return (
                <div></div>
            )

        }
    }
    computeReduce() {
        let item = this.state.displayReduse;
        let redusePrice = this.state.ReducePrice ? this.state.ReducePrice.toString().replace(/,/g, "") : 0;
        let getFromCredit = 0;
        for (let i = 0; i < this.state.GridData.length; i++) {
            if (this.state.GridData[i]._id != this.state.displayReduse._id)
                getFromCredit += this.state.GridData[i].getFromCredit ? this.state.GridData[i].getFromCredit : 0;
        }
        if (parseInt(redusePrice) > (item.OrgPrice ? (item.number * item.OrgPrice) : (item.number * item.price))) {
            Alert.warning('مقدار وارد شده از مبلغ محصول بیشتر است', 5000);
            return;
        }
        if (parseInt(redusePrice) > (parseInt(this.state.credit) - getFromCredit)) {
            Alert.warning('مقدار وارد شده بیش از مبلغ کیف پول شماست', 5000);
            return;
        }
        let price = item.OrgPrice ? (item.number * item.OrgPrice) : (item.number * item.price);//item.number*(parseInt((item.products[0].price - (item.products[0].price * ((!item.products[0].NoOff ? parseInt(this.props.off) : 0)+item.products[0].off))/100)))
        let Comm = item.Seller[0].CreditCommission ? (((parseInt(item.Seller[0].CreditCommission))*parseInt(redusePrice))/100) : 0;
        //let Comm = 0;
        let lastPrice = price - parseInt(redusePrice) + Comm;
        if (lastPrice >= 0)
            this.setState({
                PriceAfterCompute: this.roundPrice(lastPrice),
                ShowAlarm: true
            })

    }
    persianNumber(input) {
        var persian = { 0: '۰', 1: '۱', 2: '۲', 3: '۳', 4: '۴', 5: '۵', 6: '۶', 7: '۷', 8: '۸', 9: '۹' };
        var string = (input + '').split('');
        var count = string.length;
        var num;
        for (var i = 0; i <= count; i++) {
            num = string[i];
            if (persian[num]) {
                string[i] = persian[num];
            }
        }
        return string.join('');
    }
    render() {
        const renderDialogFooter = (name) => {
            return (
                <div>
                    <Button style={{ fontFamily: 'YekanBakhFaBold' }} label="انصراف" icon="pi pi-times" onClick={() => onHide()} className="p-button-text" />
                    <Button style={{ fontFamily: 'YekanBakhFaBold' }} label="تایید" disabled={!this.state.ShowAlarm} icon="pi pi-check" onClick={() => onHide(1)} autoFocus />
                </div>
            );
        }
        const onHide = (ok) => {
            let ReducePrice = this.state.ReducePrice ? this.state.ReducePrice.toString().replace(/,/g, "") : 0;


            if (ok) {
                let GridData = this.state.GridData;
                let Comm = 0;
                for (let i = 0; i < GridData.length; i++) {
                    Comm = GridData[i].Seller[0].CreditCommission ? (((parseInt(GridData[i].Seller[0].CreditCommission)) * parseInt(ReducePrice)) / 100) : 0;

                    if (GridData[i]._id == this.state.displayReduse._id) {

                        if (!GridData[i].OrgPrice)
                            GridData[i].OrgPrice = GridData[i].price;


                        GridData[i].price = parseInt(GridData[i].OrgPrice) - (parseInt(ReducePrice) / GridData[i].number) + (Comm / GridData[i].number)
                        GridData[i].getFromCredit = parseInt(ReducePrice)

                    }

                }
                let lastPrice = 0,
                    finalCreditReducer = 0;
                for (let i = 0; i < GridData.length; i++) {
                    if (GridData[i].getFromCredit)
                        finalCreditReducer += parseInt(GridData[i].getFromCredit);
                    lastPrice += parseInt(GridData[i].price * GridData[i].number);
                }
                this.setState({
                    finalCreditReducer: finalCreditReducer,
                    lastPrice: lastPrice/*this.roundPrice(parseInt(this.state.orgLastPrice)+Comm-finalCreditReducer)*/,
                    GridData: GridData
                })
            }
            this.setState({
                displayReduse: false,
                ShowAlarm: false,
                ReducePrice: 0

            })
        }
        return (
            <div>

                <Header1 />
                <Header2 />
                {!this.state.loading ?
                <div>
                <div className="row justify-content-center d-lg-flex d-md-flex" style={{ direction: 'ltr', marginBottom: 50, marginTop: 30 }}  >
                    <div className="col-9  yekan alert-light" style={{ padding: 20, display: 'none' }} >
                        {this.state.GridData.length > 0 &&
                            <Steps current={this.state.StepNumber} vertical={this.state.StepVertical} >
                                <Steps.Item title="سبد خرید" />
                                <Steps.Item title="تکمیل خرید" />
                                <Steps.Item title="تایید آدرس" />
                                <Steps.Item title={(this.state.ActiveBank != "none" && this.state.ActiveBank != "inPlace" && this.state.ActiveBank !='Cheque' ) ? "انتقال به سایت بانک" : "ثبت نهایی"} status="wait" />
                            </Steps>
                        }
                    </div>
                </div>

                <div className="row justify-content-center firstInPage" style={{ direction: 'rtl' }}   >

                    <div className="col-lg-8" style={{ backgroundColor: '#fff', borderRadius: 5 }}>
                        <Toast ref={this.toast} position="bottom-left" style={{ fontFamily: 'YekanBakhFaBold', textAlign: 'right' }} />

                        {this.state.GridData.length > 0 ?
                            <div>
                                <div className="col-12" style={{ textAlign: 'right', marginBottom: 50 }}>
                                    {(this.state.ActiveBank != 'none') &&
                                        <div>
                                            <p className="yekan" style={{ paddingTop: 20 }}>شیوه پرداخت</p>
                                        </div>
                                    }
                                    {(this.state.ActiveBank != 'none') ? 
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <RadioButton inputId="TypeOfPayment1" name="TypeOfPayment" value="1" onChange={(e) => { this.setState({ ActiveBank: this.state.OriginalActiveBank }); this.setState({ TypeOfPayment: e.value }); }} checked={this.state.TypeOfPayment === '1'} />
                                            <label htmlFor="TypeOfPayment1" className="p-checkbox-label yekan" style={{ marginRight: 20, color: 'rgb(185 185 185)' }}>
                                                پرداخت اینترنتی <br />
                                                آنلاین با تمامی کارت‌های بانکی
                                        </label>
                                        </div>
                                        <div style={{ display: 'flex' }}>
                                            <RadioButton inputId="TypeOfPayment2" name="TypeOfPayment" value="2" onChange={(e) => { this.setState({ ActiveBank: 'inPlace' }); this.setState({ TypeOfPayment: e.value }); }} checked={this.state.TypeOfPayment === '2'} />
                                            <label htmlFor="TypeOfPayment2" className="p-checkbox-label yekan" style={{ marginRight: 20, color: 'rgb(185 185 185)' }}>پرداخت در محل</label>
                                        </div>
                                        {this.state.SaleByCheque &&
                                            <div style={{ display: 'flex' }}>
                                                <RadioButton inputId="TypeOfPayment3" name="TypeOfPayment" value="4" onChange={(e) => { this.setState({ ActiveBank: 'Cheque' }); this.setState({ TypeOfPayment: e.value }); }} checked={this.state.TypeOfPayment === '4'} />
                                                <label htmlFor="TypeOfPayment3" className="p-checkbox-label yekan" style={{ marginRight: 20, color: 'rgb(185 185 185)' }}>پرداخت با چک</label>
                                            </div>
                                        }
                                    </div>
                                    :
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        {this.state.SaleByCheque &&
                                            <div style={{ display: 'flex' }}>
                                                <RadioButton inputId="TypeOfPayment3" name="TypeOfPayment" value="4" onChange={(e) => { this.setState({ ActiveBank: 'Cheque' }); this.setState({ TypeOfPayment: e.value }); }} checked={this.state.TypeOfPayment === '4'} />
                                                <label htmlFor="TypeOfPayment3" className="p-checkbox-label yekan" style={{ marginRight: 20, color: 'rgb(185 185 185)' }}>پرداخت با چک</label>
                                            </div>
                                        }

                                    </div>
                                    }

                                    {this.state.TypeOfPayment == 4 &&
                                        <div>
                                            {Array.from(Array(parseInt(this.state.ChequeInfo.MaxCheque)).keys()).map((item,index)=>{
                                                return(
                                                    <div className="row" style={{alignItems:'baseline'}}>
                                                        <div className="col-lg-2">
                                                        <div className="group">
                                                            <input className="form-control irsans" autoComplete="off" type="text" id={"InChequeNumber_" + index} name={"InChequeNumber_" + index} value={this.state["chequeNumber_" + index]} onChange={(event) => { this.setState({ ["InChequeNumber_" + index]: event.target.value }) }} required="true" />
                                                            <label>شماره چک</label>
                                                        </div>
                                                        </div>
                                                        <div className="col-lg-2">
                                                        <DatePicker
                                                                onChange={value => this.setState({["InChequeDate_" + index]: value})}
                                                                value={this.state["InChequeDate_" + index]}
                                                                isGregorian={false}
                                                                timePicker={false}
                                                                placeholder="تاریخ چک"
                                                                persianDigits={false}

                                                            />
                                                      
                                                        </div>
                                                        <div className="col-lg-2">
                                                        <div className="group">
                                                            <input className="form-control irsans" autoComplete="off" type="text" id={"InChequeAmount_" + index} name={"InChequeAmount_" + index} value={this.state["InChequeAmount_" + index]} onChange={(event) => { this.setState({ ["InChequeAmount_" + index]: event.target.value.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",") }) }} required="true" />
                                                            <label>مبلغ چک (تومان)</label>
                                                        </div>
                                                        </div>
                                                        <div className="col-lg-2">
                                                        <div className="group">
                                                            <input className="form-control irsans" autoComplete="off" type="text" id={"InChequeName_" + index} name={"InChequeName_" + index} value={this.state["chequeName_" + index]} onChange={(event) => { this.setState({ ["InChequeName_" + index]: event.target.value.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",") }) }} required="true" />
                                                            <label>صاحب حساب</label>
                                                        </div>
                                                        </div>
                                                        <div className="col-lg-2">
                                                            <div className="group">
                                                                <input className="form-control yekan" autoComplete="off" onChange={this.FileUpload} type="file" id={"InChequeFile_" + index} name={"InChequeFile_" + index} />
                                                                <label>آپلود تصویر چک</label>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-2">
                                                            <img src={this.state["InChequeImg_" + index]} id={"InChequeImg_" + index} name={"InChequeImg_" + index} />
                                                        </div>
                                                        
                                                    </div>
                                                )
                                            })}
                                        </div>    

                                    }




                                    <hr />
                                </div>

                                <DataView value={this.state.GridData} layout={this.state.layout} rows={100} itemTemplate={this.itemTemplate}></DataView>
                            </div>
                            :
                            (
                                this.state.refId ?
                                    <p style={{ textAlign: 'center', paddingTop: 50, fontSize: 25 }} className="YekanBakhFaBold">{this.state.EndMessage}</p>
                                    :
                                    (this.state.CartItemsGet
                                        ?
                                        <p style={{ textAlign: 'center', paddingTop: 50, marginBottom: 250, fontSize: 25 }} className="YekanBakhFaBold">سبد خرید شما خالی است</p>
                                        :
                                        <div style={{ zIndex: 10000 }} >
                                            <p style={{ textAlign: 'center' }}>
                                                <img src={require('../public/loading.gif')} style={{ width: 320, display: 'none' }} />
                                            </p>

                                        </div>

                                    )
                            )


                        }
                    </div>
                    {this.state.GridData.length > 0 &&
                        <div className="col-lg-3">

                            <div className="card mt-md-0 mt-5" style={{ padding: 10, borderRadius: 20 }}>

                                <div style={{ textAlign: 'left', marginRight: 10, borderBottom: '1px solid #eee' }} >
                                    <p className="YekanBakhFaBold">موجودی کیف پول : {this.state.credit?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} تومان</p>

                                </div>
                                {
                                    this.state.paykAmount > 0 &&
                                    <p className="YekanBakhFaMedium" style={{ fontSize: 14, textAlign: 'center', marginTop: 10, color: 'slategrey' }}>{this.persianNumber(this.state.paykAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")) + "  تومان"} به عنوان هزینه ارسال به مبلغ سفارش اضافه شد</p>

                                }
                                <p className="YekanBakhFaMedium" style={{ textAlign: "center", marginTop: 40, borderBottom: "1px solid #eee" }}><span style={{ paddingLeft: 25 }}>مبلغ قابل پرداخت </span> <span style={{ color: '#a01212', fontSize: 25, marginTop: 50 }}> {this.state.lastPrice != "0" ? this.persianNumber((parseInt(this.state.paykAmount) + parseInt(this.state.lastPrice)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")) + "  تومان" : "        "}



                                    {
                                        this.state.finalCreditReducer > 0 &&
                                        <p className="YekanBakhFaMedium" style={{ fontSize: 12, marginTop: 10 }}>{this.persianNumber(this.state.finalCreditReducer.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")) + "  تومان"} از کیف پول شما کسر خواهد شد</p>

                                    }
                                </span>  </p>
                                {this.state.AcceptAddress ?
                                    <p className="YekanBakhFaMedium" style={{ textAlign: 'center' }} >

                                        <span style={{ fontSize: 13 }}>سفارش شما به آدرس زیر ارسال می شود : </span> <br /><br />
                                        <span style={{ fontSize: 20, color: 'rgb(2 125 0)' }}>  {this.state.Address} </span>  <br /><br />
                                        <Link to={`${process.env.PUBLIC_URL}/user?Active=5`} style={{ textDecoration: 'none', fontSize: 18,fontStyle:'italic' }} className="YekanBakhFaMedium">برای ویرایش آدرس اینجا کلیک کنید</Link>
                                    </p>
                                    :
                                    <p>

                                    </p>
                                }
                                {(this.state.ActiveBank != "none" && this.state.ActiveBank != "inPlace" && this.state.ActiveBank != "Cheque"  ) ?
                                    <button className="btn btn-success YekanBakhFaMedium" style={{ marginTop: 40, marginBottom: 10 }} disabled={(this.state.AcceptAddress && (!this.state.Address || this.state.Address == ""))} onClick={this.Payment}>{this.state.AcceptAddress ? <span>پرداخت</span> : <span>ادامه فرایند خرید</span>}  </button>

                                    :
                                    <button className="btn btn-success YekanBakhFaMedium" style={{ marginTop: 40, marginBottom: 10 }} onClick={this.Payment}>{this.state.AcceptAddress ? <span>ثبت نهایی</span> : <span>ادامه فرایند خرید</span>}  </button>

                                }
                            </div>

                        </div>
                    }
                </div>
                </div>
                :
                <div style={{ zIndex: 10000 }} >
                    <p style={{ textAlign: 'center' }}>
                        
                        <img src={this.state.loading_pic}  />
                    </p>
            
                    </div>
                }
                {this.state.CatId && !this.state.loading &&
                    <div style={{ marginTop: 90 }}>
                        <CatList _id={this.state.CatId} UId={this.state.userId} name="پیشنهاد برای شما" paddingLeft="70" paddingRight="70" />
                    </div>
                }
                {!this.state.loading &&
                    <Footer />
                }

                <Sidebar header="کسر از کیف پول " visible={this.state.displayReduse} style={{ fontFamily: 'YekanBakhFaBold' }} footer={renderDialogFooter()} onHide={() => onHide()}>

                    <div className="row">
                        <div className="col-12 mt-5 mb-3" style={{textAlign:'center'}}>
                            <h2 className="YekanBakhFaMedium">کسر از کیف پول</h2>
                        </div>
                        <div className="col-12">
                            <p className="YekanBakhFaBold" style={{ textAlign: 'center' }}>موجودی کیف پول : <span style={{fontStyle:'bold'}}>{(parseInt(this.state.credit)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span> تومان</p>
                            <p className="YekanBakhFaBold" style={{ textAlign: 'center' }}>موجودی قابل برداشت : {(parseInt(this.state.credit) - parseInt(this.state.finalCreditReducer)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} تومان</p>
                        </div>
                        <div className="col-md-12 col-12" >
                            <div className="group">
                                <input className="form-control YekanBakhFaBold" placeholder="مبلغ را وارد کنید" autoComplete="off" type="text" value={this.state.ReducePrice} name="ReducePrice" onChange={(event) => { this.setState({ ReducePrice: event.target.value.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ","), ShowAlarm: false }) }} required="true" />
                                <label>مبلغ را وارد کنید</label>
                            </div>

                        </div>
                        <div className="col-md-12 col-12 mt-5  mb-5" style={{ textAlign: 'center' }} >
                            <Button label="محاسبه مبلغ" onClick={this.computeReduce} style={{ fontFamily: 'YekanBakhFaBold' }} className="btn btn-info" />

                        </div>
                        
                        <div className="col-12" style={{ textAlign: 'center', display: 'flex', justifyContent: 'space-between' }}>
                            <Button style={{ fontFamily: 'YekanBakhFaBold' }} label="انصراف" icon="pi pi-times" onClick={() => onHide()} />
                            <Button style={{ fontFamily: 'YekanBakhFaBold' }} label="تایید" disabled={!this.state.ShowAlarm} icon="pi pi-check" className="btn btn-success" onClick={() => onHide(1)} autoFocus />

                        </div>
                        <div className="col-12 mt-5" >
                            {this.state.ShowAlarm &&
                                <p className="YekanBakhFaBold" style={{ textAlign: 'center', color: 'red', padding: 20, textAlign: 'center', fontSize: 18 }}>
                                    <span>
                                        برای خرید این محصول مبلغ
                                        <br/>
                                        &nbsp;
                    {this.state.PriceAfterCompute.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} تومان
                    <br/>
                     به صورت نقدی پرداخت خواهید کرد
                    </span>
                                    <span>
                                        &nbsp;
                                        و مبلغ
                                        <br/>
                                        &nbsp;
                        {this.state.ReducePrice} تومان
                        <br/>
                    از کیف پول شما کسر خواهد شد

                    </span>
                                </p>
                            }

                        </div>

                    </div>
                    <div>

                    </div>
                </Sidebar >
            </div>

        )
    }
}
const mapStateToProps = (state) => {
    return {
        CartNumber: state.CartNumber,
        off: state.off,
        credit: state.credit
    }
}
export default withRouter(
    connect(mapStateToProps)(Cart)
);