import React, { Component } from 'react';
import axios from 'axios'
import { BrowserRouter, Route, withRouter, Redirect, Link } from 'react-router-dom'
import 'pure-react-carousel/dist/react-carousel.es.css';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Swiper from 'react-id-swiper';
import 'swiper/css/swiper.css';
import CatList from './CatList.js'
import Photos from './Photos.js'
import { Skeleton } from 'primereact/skeleton';
import SlideBox  from './SlideBox.js'
import TopBox  from './TopBox.js'


import ShopList from './ShopList.js'

import './Header1.css'
import Server from './Server.js'
import moment from 'moment-jalaali';
import { connect } from 'react-redux';

const params3 = {
  slidesPerView: 1,
  autoplay: {
    delay: 5000,
    disableOnInteraction: false
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
}
const params1 = {
  autoplay: {
    delay: 4000,
    disableOnInteraction: false
  },
  loop: 1,
  slidesPerView: 3,
  spaceBetween: 30,
  freeMode: true,
  breakpoints: {
    1024: {
      slidesPerView: 5,
      spaceBetween: 40
    },
    768: {
      slidesPerView: 3,
      spaceBetween: 30
    },
    640: {
      slidesPerView: 2,
      spaceBetween: 20
    },
    320: {
      slidesPerView: 1,
      spaceBetween: 10
    }
  }
}
const params2 = {
  slidesPerView: 'auto',
  centeredSlides: true,
  spaceBetween: 30,
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  breakpoints: {
    1024: {
      centeredSlides: false,
      slidesPerView: 3,
      spaceBetween: 20
    },
    
    768: {
      centeredSlides: false,
      slidesPerView: 2,
      spaceBetween: 15
    },
    640: {
      centeredSlides: false,
      slidesPerView: 1
    },
    320: {
      slidesPerView: 1
    }
  }

}

const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 5
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1
  }
};
const responsiveOne = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 1
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 1
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1
  }
};

class MainBox2 extends React.Component {
  constructor(props) {
    super(props);
    this.Server = new Server();

    this.myRef = React.createRef()   // Create a ref object 
    this.state = {
      products: [],
      productsBestOff: [],
      BestShops: [],
      Newproducts: [{
        title: "",
        fileUploaded: "",
        subTitle: "",
        desc: ""
      },
      {
        title: "",
        fileUploaded: "",
        subTitle: "",
        desc: ""
      },
      {
        title: "",
        fileUploaded: "",
        subTitle: "",
        desc: ""
      }],
      UId: null,
      levelOfUser: null,
      MaxObj: [],
      HsrajDate: moment(),
      GotoLogin: false,
      GotoCart: false,
      pics: [],
      Randproducts: [],
      shopList:[],
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
     
      logo4: null,
      logo5: null,
      
      link4: null,
      link5: null,
      
      text4: null,
      text5: null,
      SpecialImage:null,
      loading: true,
      cats: [],
      absoluteUrl: this.Server.getAbsoluteUrl(),
      url: this.Server.getUrl()
    }
    this.SendToCart = this.SendToCart.bind(this);

    axios.post(this.state.url + 'checktoken', {
      token: localStorage.getItem("api_token")
    })
      .then(response => {
        this.setState({
          UId: response.data.authData.userId,
          levelOfUser: response.data.authData.levelOfUser
        })
        this.getSettings();
      })
      .catch(error => {
        this.getSettings();

      })




  }
  getSettings(){
    axios.post(this.state.url+'getSettings', {
        token: localStorage.getItem("api_token")
      })
      .then(response => {
        this.setState({
            Template:response.data.result ? response.data.result.Template : "1",
            ProductBase: response.data.result ? response.data.result.ProductBase : false,
            SaleFromMultiShops: response.data.result ? response.data.result.SaleFromMultiShops : false,
            Theme:response.data.result ? response.data.result.Theme : "1"

        })
        this.getPics();

      })
      .catch(error => {
        console.log(error)
        this.getPics();

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
  getCategory(p) {
    let condition = p ? { condition: {pic: { $ne: null },Deactive:{$ne:true },Special:true } } : { condition: { showInSite: true,Deactive:{$ne:true }} };
    axios.post(this.state.url + 'GetCategory', condition)
      .then(response => {
        let resp = [];
        let forRem = []
        response.data.result.sort((a, b) => (a.order > b.order) ? 1 : ((b.order > a.order) ? -1 : 0));
        if (p) {
          this.setState({
            cats: response.data.result
          })
          this.getCategory();

        }
        else {
          this.setState({
            catsList: response.data.result
          })
          if(this.state.ProductBase){
            this.getProducts(0)
          }else{
            this.getShops();
          }
        }
      })
      .catch(error => {
        if (p)
          this.getCategory();
        else

        console.log(error)
      })

  }
  getShops(){
      let condition = {condition:{showInSite:true}};
      axios.post(this.state.url + 'getShops', condition)
        .then(response => {
          this.getProducts(0)

            this.setState({
              shopList: response.data.result
            })
            
  
  
        })
        .catch(error => {
          this.getProducts(0)

        })
  
  }
  getPics(l, type) {
    let that = this;
    axios.post(this.state.url + 'getPics', {})
      .then(response => {
        response.data.result.map(function (item, index) {
          
          if (item.name == "file4")
            that.setState({
              logo4: item.fileUploaded ? that.state.absoluteUrl +  item?.fileUploaded?.split("public")[1] : null,
              link4: item.link,
              text4: item.text
            })
            
          if (item.name == "file5")
            that.setState({
              logo5: item.fileUploaded ? that.state.absoluteUrl +  item?.fileUploaded?.split("public")[1]:null,
              link5: item.link,
              text5: item.text
            })
          if (item.name == "file8")
            that.setState({
              logo8: item.fileUploaded ? that.state.absoluteUrl +  item?.fileUploaded?.split("public")[1]:null,
              link8: item.link,
              text8: item.text
            })
          if (item.name == "file9")
            that.setState({
              logo9: item.fileUploaded ? that.state.absoluteUrl +  item?.fileUploaded?.split("public")[1]:null,
              link9: item.link,
              text9: item.text
            })  
          if (item.name == "file11"){
            that.setState({
              SpecialImage: that.state.absoluteUrl +  item?.fileUploaded?.split("public")[1]
            })
          }
          if (item.name == "file13"){

            that.setState({
              loading_pic: that.state.absoluteUrl +  item?.fileUploaded?.split("public")[1]
            })
          }
              
        })
        that.getCategory(1);
      })
      .catch(error => {
        that.getCategory(1);
      })

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
  getProducts(l, type) {
    axios.post(this.state.url + 'getProducts', {
      token: localStorage.getItem("api_token"),
      levelOfUser: this.state.levelOfUser,
      type: type,
      limit: l
    })
      .then(response => {
        /*let off=[];
        response.data.result.map(function(v,i){
            off[i]=parseInt(v.off);
        })
        let Max = Math.max(...off);
        let obj = null;
        response.data.result.map(function(v,i){
            if(v.off==Max)
                obj=v;
        })*/
        if (!type) {

          if (response.data.result[0]) {
            var HarajDate = response.data.result[0].HarajDate,
              ExpireDate = response.data.result[0].ExpireDate,
              TodayDate = response.data.extra ? response.data.extra.TodayDate : null;


            if (ExpireDate >= TodayDate) {
              var that = this;
              var x = setInterval(function () {
                //let ExpireDate = (that.myRef && that.myRef.current && that.myRef.current.attributes.expiredate.value) ? that.myRef.current.attributes.expiredate.value : response.data.result[0].ExpireDate;
                let ExpireDate = (that.myRef.current && that.myRef.current && that.myRef.current.getElementsByClassName("swiper-slide-active") && that.myRef.current.getElementsByClassName("swiper-slide-active")[0].attributes.expiredate.value) ? that.myRef.current.getElementsByClassName("swiper-slide-active")[0].attributes.expiredate.value : response.data.result[0].ExpireDate;
                var distance = new Date(ExpireDate + " 23:59:59") - new Date(new moment().locale('fa').format("jYYYY/jMM/jDD HH:mm:ss"));

                var day = Math.floor(distance / (1000 * 60 * 60 * 24));
                var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                var seconds = Math.floor((distance % (1000 * 60)) / 1000);

                // Display the result in the element with id="demo"
                that.setState({
                  days: day,
                  hours: hours,
                  minutes: minutes,
                  seconds: seconds
                })

                // If the count down is finished, write some text
                if (distance < 0) {
                  that.setState({
                    MaxObj: []
                  })
                  clearInterval(x);
                  //document.getElementById("demo").innerHTML = "EXPIRED";
                }
              }, 1000);



              var maximg = this.state.absoluteUrl + response.data.result[0].fileUploaded.split("public")[1];
              this.setState({
                MaxObj: response.data.result,
                maximg: maximg
              })
            }
          }
          //this.getProducts(8,"bestselling");
          this.getProducts(8, "special");


        }
        if (type == "special") {
          this.setState({
            products: response.data.result
          })

        }
        this.setState({
          loading:false
        })
        setTimeout(()=>{
          this.props.callback({});

        },5000)




      })
      .catch(error => {
        console.log(error)
      })

  }

  SendToCart(PId, Number, UId, Price) {
    let that = this;

    axios.post(this.state.url + 'checktoken', {
      token: localStorage.getItem("api_token")
    })
      .then(response => {
        that.setState({
          UId: response.data.authData.userId
        })
        let param = {
          PId: PId,
          Number: Number,
          UId: response.data.authData.userId,
          Price: Price,
          Status: "0",
          Type: "insert",
          token: localStorage.getItem("api_token")
        };
        let SCallBack = function (response) {
          let res = response.data.result;
          //alert(res)
          /*let { history } = that.props;
          history.push({
              pathname: '/cart'
          })*/
          that.setState({
            GotoCart: true
          })

        };
        let ECallBack = function (error) {
          //alert(error)
        }
        that.Server.send("MainApi/ManageCart", param, SCallBack, ECallBack)

      })
      .catch(error => {
        that.setState({
          GotoLogin: true
        })
        console.log(error)
      })

  }
  render() {
    let C = this.state.MaxObj.length == 0 ? "col-lg-12 col-12" : "col-lg-8 col-12";
    const responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 3,
        numScroll: 3
      },
      {
        breakpoint: '768px',
        numVisible: 2,
        numScroll: 2
      },
      {
        breakpoint: '560px',
        numVisible: 1,
        numScroll: 1
      }
    ];
    if (this.state.GotoLogin) {
      return <Redirect to={"/login"} push={true} />;
    }
    if (this.state.GotoCart) {
      return <Redirect to={"/cart"} push={true} />;
    }
    return (


      !this.state.loading ?
        <div>



          <div className="row" >
            {this.state.Theme != "2" ?
              <div className="col-lg-12 col-12" >
                <div className="row" style={{ marginTop: 10, marginBottom: 20 }}>

                  <div className={(this.state.logo5 && this.state.ProductBase) ? "col-lg-9 col-12 TopSlider" : "col-lg-12 col-12 TopSlider"}  >   
                    <SlideBox Theme={this.state.Theme}/> 
                  </div>

                  {this.state.ProductBase &&
                    <div className="col-lg-3 col-0 d-lg-block d-none "  >
                      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <div style={{ height: '49%', overflow: 'hidden' }}>
                          
                          {this.state.link4 && this.state.link4.indexOf("http") > -1 ?
                            <a href={this.state.link4} className="" target="_blank" style={{ textDecoration: 'none' }}>
                              {this.state.text4 &&
                                <p className="iranyekanwebmedium  p-md-3 , p-0" style={{ position: 'absolute', zIndex: 2, fontSize: 16, color: '#fff', backgroundColor: 'rgba(20, 15, 21, 0.09)', paddingBottom: 5, width: '37%', textAlign: 'right', boxShadow: '10px 10px 15px #e6d5d5', bottom: 0 }}>{this.state.text4}</p>
                              }
                              <div style={{ width: '100%', height: '100%', backgroundSize: 'cover', borderRadius: 12, backgroundImage: `url(${this.state.logo4})` }} ></div>
                            </a>
                            :
                            <Link to={`${process.env.PUBLIC_URL}/` + this.state.link4} className="" href="#" target="_blank" style={{ textDecoration: 'none' }}>
                              {this.state.text4 &&
                                <p className="iranyekanwebmedium  p-md-3 , p-0" style={{ position: 'absolute', zIndex: 2, fontSize: 16, color: '#fff', backgroundColor: 'rgba(20, 15, 21, 0.09)', paddingBottom: 5, width: '37%', textAlign: 'right', boxShadow: '10px 10px 15px #e6d5d5', bottom: 0 }}>{this.state.text4}</p>
                              }
                              <div style={{ width: '100%', height: '100%', backgroundSize: 'cover', borderRadius: 12, backgroundImage: `url(${this.state.logo4})` }} ></div>
                            </Link>
                          }
                        </div>
                        <div style={{ height: '2%' }}>

                        </div>
                        <div style={{ height: '49%', overflow: 'hidden' }}>
                          {this.state.link5 && this.state.link5.indexOf("http") > -1 ?
                            <a href={this.state.link5} className="" target="_blank" style={{ textDecoration: 'none' }}>
                              {this.state.text5 &&
                                <p className="iranyekanwebmedium  p-md-3 , p-0" style={{ position: 'absolute', zIndex: 2, fontSize: 16, color: '#fff', backgroundColor: 'rgb(20 15 21 / 76%)', paddingBottom: 5, width: '50%', textAlign: 'right', boxShadow: '10px 10px 15px #e6d5d5', bottom: 0 }}>{this.state.text5}</p>
                              }
                              <div style={{ width: '100%', height: '100%', backgroundSize: 'cover', borderRadius: 12, backgroundImage: `url(${this.state.logo5})` }} ></div>
                            </a>
                            :
                            <Link to={`${process.env.PUBLIC_URL}/` + this.state.link5} className="" href="#" target="_blank" style={{ textDecoration: 'none' }}>
                              {this.state.text5 &&
                                <p className="iranyekanwebmedium  p-md-3 , p-0" style={{ position: 'absolute', zIndex: 2, fontSize: 16, color: '#fff', backgroundColor: 'rgb(20 15 21 / 76%)', paddingBottom: 5, width: '50%', textAlign: 'right', boxShadow: '10px 10px 15px #e6d5d5', bottom: 0 }}>{this.state.text5}</p>
                              }
                              <div style={{ width: '100%', height: '100%', backgroundSize: 'cover', borderRadius: 12, backgroundImage: `url(${this.state.logo5})` }} ></div>
                            </Link>
                          }

                        </div>
                      </div>

                    </div>
                  }

                </div>
              </div>
              :
              <div className="col-lg-12 col-12"  >
                <div className="row" style={{ marginTop: 10, marginBottom: 20 }}>

                  <div className="col-lg-12 col-12 TopSlider"  >   
                    <TopBox Theme={this.state.Theme} part="1" /> 
                  </div>
                </div>
              </div>
            }
            {!this.state.ProductBase && this.state.Theme != "2" &&
            <div className="col-lg-12 col-12" >
            <div className="row" style={{ marginBottom: 20, marginLeft: 20, marginRight: 20, marginTop: 20, padding: 20, borderRadius: 20 }}>
              
                    <div className="col-md-3 col-12 mb-md-0 mb-3">
                      {!this.state.logo4 &&
                           <Skeleton width="100%" height="100%"/>
                      }
                      <Link to={`${process.env.PUBLIC_URL}/` + this.state.link4} href="#" target="_blank" style={{ textDecoration: 'none', height: 120 }}>
                        <img style={{ width: '100%' }} src={this.state.logo4}></img>
                      </Link>
                      
                      </div>
                      <div className="col-md-3 col-12 mb-md-0 mb-3">
                      {!this.state.logo5 &&
                           <Skeleton width="100%" height="100%"/>
                      }
                      <Link to={`${process.env.PUBLIC_URL}/` + this.state.link5} href="#" target="_blank" style={{ textDecoration: 'none', height: 120 }}>
                        <img style={{ width: '100%' }} src={this.state.logo5}></img>
                      </Link></div>
                      <div className="col-md-3 col-12 mb-md-0 mb-3">
                      {!this.state.logo8 &&
                           <Skeleton width="100%" height="100%"/>
                      }
                      <Link to={`${process.env.PUBLIC_URL}/` + this.state.link8} href="#" target="_blank" style={{ textDecoration: 'none', height: 120 }}>
                        <img style={{ width: '100%' }} src={this.state.logo8}></img>
                      </Link></div>
                      <div className="col-md-3 col-12 mb-md-0 mb-3">
                      {!this.state.logo9 &&
                           <Skeleton width="100%" height="100%"/>
                      }
                      <Link to={`${process.env.PUBLIC_URL}/` + this.state.link9} href="#" target="_blank" style={{ textDecoration: 'none', height: 120 }}>
                        <img style={{ width: '100%' }} src={this.state.logo9}></img>
                      </Link></div>
                      
                  

            </div>
            </div>
            }
            {this.state.products.length > 0 &&
              <div className="col-lg-12 col-12"  >
                <div style={{ background: 'rgb(85 216 255)', marginTop: 50, borderTopRightRadius: 5, borderBottomRightRadius: 5, borderTopLeftRadius: 5, borderBottomLeftRadius: 5, marginRight: 20, marginBottom: 50 }} >
                  <div className=" backgroundsvg" style={{ direction: 'rtl', padding:40,display:'flex',alignItems:'center' }}>
                    <div style={{ maxWidth: 230}} className="d-sm-block d-none">
                        <p className="iranyekanwebblack" style={{ marginTop: 15, color: '#fff', marginLeft: 20, fontSize: 18,textAlign:'center',display:'none' }}>محصولات شگفت انگیز</p>
                        {this.state.SpecialImage &&
                        <img src={this.state.SpecialImage}   />
                        }
                      </div>
                    <Swiper {...params2}>
                      
                      {this.state.products.map((item, index) => {
                        var img = this.state.absoluteUrl + (item.fileUploaded ? item.fileUploaded.split("public")[1] : "/nophoto.png");
                        return (

                          <Link className="car-details" to={`${process.env.PUBLIC_URL}/Products?name=${item.title}&id=` + ((item.product_detail && item.product_detail.length > 0) ? item.product_detail[0]._id : item._id)} style={{ padding: 22, textDecorationStyle: 'none', borderRadius: 10, background: '#fff', color: '#333', maxWidth: 250,minWidth:250 }}>
                            <p className="iranyekanwebblack d-sm-none d-block" style={{ marginTop: 15, color: '#fff', marginLeft: 20, fontSize: 18,textAlign:'center',position:'absolute',top:0,left:0,backgroundColor:'#72d006',padding:5,zIndex:2,borderRadius:5 }}>شگفت انگیز</p>

                            <div className="p-grid p-nogutter" >
                              <div className="p-col-12 c-product-box__img" align="center" >
                                <img src={img} alt="" />
                              </div>
                              <div className="p-col-12 car-data" style={{ marginTop: 10 }}>
                                <div className="car-title iranyekanwebmedium" style={{ textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: 14 }}>{item.title}</div>

                                <div className="car-title iranyekanwebmedium" style={{ textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: 12, marginTop: 5, marginBottom: 5 }} >{item.subTitle}</div>
                                {
                                  item.number > 0
                                    ?
                                    <div>
                                      {(this.state.UId || !item.ShowPriceAftLogin) &&
                                        <div>
                                          {
                                            ((!item.NoOff ? parseInt(this.props.off) : 0) + item.off) > "0" ?
                                              <div className="car-subtitle oldPrice  iranyekanwebmedium" style={{ textAlign: 'center', fontSize: 11, color: '#a09696' }} >{this.persianNumber(this.roundPrice(item.price.toString()).replace(/\B(?=(\d{3})+(?!\d))/g, ","))} </div>
                                              :
                                              <div className="car-subtitle iranyekanwebmedium" style={{ textAlign: 'center', textDecoration: 'line-through', fontSize: 11, color: '#a09696', height: 16 }} ></div>
                                          }
                                          <div className="car-subtitle iranyekanwebmedium" style={{ textAlign: 'center' }} ><span className="iranyekanwebmedium" style={{ float: 'left', fontSize: 11, marginTop: 10 }}>تومان</span> <span className="iranyekanwebmedium" style={{ fontSize: 20 }}>{this.persianNumber(this.roundPrice((item.price - ((item.price * ((!item.NoOff ? parseInt(this.props.off) : 0) + item.off)) / 100)).toString()).replace(/\B(?=(\d{3})+(?!\d))/g, ","))}</span> </div>
                                        </div>
                                      }
                                    </div>
                                    : (this.state.UId || !item.ShowPriceAftLogin) &&
                                    <div>
                                      <div className="car-subtitle iranyekanwebmedium" style={{ height: 22 }} ></div>

                                      <div className="car-subtitle iranyekanwebmedium" style={{ textAlign: 'center' }} ><span className="iranyekanwebmedium" style={{ fontSize: 14, marginTop: 10, color: 'red' }}>ناموجود</span> </div>

                                    </div>
                                }



                              </div>
                              {
                                item.number > 0 && (parseInt(this.props.off) + item.off) > "0" &&
                                <div className="car-title iranyekanwebmedium off" style={{ position: 'absolute', top: 0, right: 0 }} >{this.persianNumber(((!item.NoOff ? parseInt(this.props.off) : 0) + item.off))} %</div>

                              }

                            </div>
                          </Link>

                        )
                      })
                      }

                    </Swiper>
                  </div>

                </div>




              </div>
            }
            {this.state.cats.length >0 &&
              <div className="col-lg-12 col-12" style={{display:'none'}} >
              <div className="row" style={{ marginBottom: 20, marginLeft: 20, marginRight: 20, marginTop: 20, padding: 20, borderRadius: 20 }}>
              
                {this.state.cats.map((item, index) => {
                  if (item.pic && index < 4) {
                    return (
                      <div className="col-md-3 col-12 mb-md-0 mb-3">
                        <Link to={`${process.env.PUBLIC_URL}/category?getSubs=1&&id=` + item._id} href="#" target="_blank" style={{ textDecoration: 'none', height: 120 }}>
                          <img style={{ width: '100%' }} src={this.state.absoluteUrl + item.pic.split("public")[1]}></img>
                        </Link></div>
                    )
                  }
                })
                }

              </div>
              </div>
            }
            

            {this.state.MaxObj.length > 0 &&
              <div className="col-lg-12 col-12"  >
                <div style={{ background: 'rgb(157 232 156)',border:'5px solid rgb(157 232 156)', marginTop: 20, borderTopRightRadius: 5, borderBottomRightRadius: 5, borderTopLeftRadius: 5, borderBottomLeftRadius: 5, marginRight: 20, marginBottom: 20 }} >
                  <div className=" backgroundsvg2 box-swiper" style={{ direction: 'rtl' }}>

                    <Swiper {...params3}>
                      
                      {this.state.MaxObj.map((item, index) => {
                        var img = this.state.absoluteUrl + item.fileUploaded.split("public")[1];
                        var img1 = this.state.absoluteUrl + item.fileUploaded1.split("public")[1];
                        var img2 = this.state.absoluteUrl + item.fileUploaded2.split("public")[1];
                        return (
                          <div expiredate={item.ExpireDate} className="car-details" to={`${process.env.PUBLIC_URL}/Products?name=${item.title}&id=` + ((item.product_detail && item.product_detail.length > 0) ? item.product_detail[0]._id : item._id)} style={{ display: 'block', textDecorationStyle: 'none', color: '#333', margin: 5, padding: 5, borderRadius: 5, marginLeft: 0 }}>
                            <div className="row justify-content-center">
                            <div >
                                <div className="d-md-none d-block" style={{textAlign:'center'}}>
                                <img src={img} alt="" style={{ borderRadius: 36, height: '100%', maxHeight: 200 }} />

                                </div>
                                <div   className=" row d-md-flex d-none" style={{ height: '100%',backgroundColor:'#fff',boxShadow:'5px 5px 5px 5px #8888883d',borderRadius:5 }} >
                                
                                  <div className="col-md-12 col-12 d-md-block d-none">
                                    <img src={img} alt="" style={{ borderRadius: 5, height: '100%', maxHeight: 350 }} />
  
                                  </div>
                                  
  
                                </div>
  
                              </div>
                              <div className="col-lg-6  col-12" align="center" >
  
                                <div className="car-title IRANYekan  mt-md-5" style={{ textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: 22 }}>{item.title}</div>
                                  
                                {
                                  item.number > 0
                                    ?
                                    <div>
                                      {(this.state.UId || !item.ShowPriceAftLogin) &&
                                        <div>
                                          {
                                            ((!item.NoOff ? parseInt(this.props.off) : 0) + item.off) > "0" ?
                                              <div className="car-subtitle IRANYekan" style={{ textAlign: 'center', textDecoration: 'line-through', fontSize: 25, color: '#8e7b7b' }} >{this.persianNumber(this.roundPrice(item.price.toString()).replace(/\B(?=(\d{3})+(?!\d))/g, ","))} </div>
                                              :
                                              <div className="car-subtitle IRANYekan" style={{ textAlign: 'center', textDecoration: 'line-through', fontSize: 25, color: '#8e7b7b', height: 16 }} ></div>
  
                                          }
                                          <div className="car-subtitle IRANYekan" style={{ maxWidth:260,display:'flex',justifyContent:'space-evenly',textAlign: 'center', marginBottom: 15 }} > <span className="iranyekanwebblack" style={{ fontSize: 40 }}>{this.persianNumber(this.roundPrice((item.price - ((item.price * (item.off + (!item.NoOff ? parseInt(this.props.off) : 0))) / 100))).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))}</span> <span className="IRANYekan" style={{ float: 'left', fontSize: 22, marginTop: 10 }}>تومان</span> </div>
                                        </div>
                                      }
                                    </div>
                                    : (this.state.UId || !item.ShowPriceAftLogin) &&
                                    <div>
                                      <div className="car-subtitle IRANYekan" style={{ height: 22 }} ></div>
  
                                      <div className="car-subtitle IRANYekan" style={{ textAlign: 'center', marginBottom: 15 }} ><span className="IRANYekan" style={{ fontSize: 22, marginTop: 10, color: 'red' }}>ناموجود</span> </div>
                                    </div>
                                }
                                  <div  style={{ marginBottom: 30 }}>
  
                                    {
                                      (item.off + (!item.NoOff ? parseInt(this.props.off) : 0)) > "0" &&
                                      <div style={{ position: 'relative' }}>
                                        <div className="car-title IRANYekan off" style={{ position: 'absolute', top: -30, left: 3 }} > <span>  {this.persianNumber((item.off + (!item.NoOff ? parseInt(this.props.off) : 0)))} %</span> </div>
                                      </div>
                                    }
  
                                    <div className="deals_timer d-flex flex-row align-items-center justify-content-center" style={{ marginTop: 0 }}>
  
                                      <div >
                                        <span className="IRANYekan" style={{fontSize:30}}>فرصت باقیمانده</span>
                                        <div className="deals_timer_box clearfix" data-target-time="" >
                                        {this.state.days != "0" &&
                                          <div id="deals_timer1_day" className="deals_timer_day IRANYekan" style={{ marginLeft:10,fontSize: 25 }}>{this.state.days != "0" ? this.persianNumber(this.state.days) : ""}</div>
                                        }
                                        {this.state.days != "0" &&
                                            <div>:</div>
                                        }
                                          <div className="deals_timer_unit">
                                            <div id="deals_timer1_hr" className="deals_timer_hr IRANYekan" style={{ fontSize: 25 }}>{this.state.hours != "0" ?  this.persianNumber(this.state.hours) : ""}</div>
                                            
                                          </div>
                                          {this.state.hours != "0" &&
                                            <div>:</div>
                                          }
                                          <div className="deals_timer_unit">
                                            <div id="deals_timer1_min" className="deals_timer_min IRANYekan" style={{ fontSize: 25 }}>{this.persianNumber(this.state.minutes)}  </div>
                                          </div>
                                          <div>:</div>
                                          <div className="deals_timer_unit">
                                            <div id="deals_timer1_sec" className="deals_timer_sec IRANYekan" style={{ fontSize: 25 }}>{this.persianNumber(this.state.seconds)}</div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div >
                                    <Link to={`${process.env.PUBLIC_URL}/Products?name=${item.title}&id=` + ((item.product_detail && item.product_detail.length > 0) ? item.product_detail[0]._id : item._id)} className="caption button-radius animated fadeInRight IRANYekan" href="#" style={{ display: "inline-block", textDecoration: 'none',fontSize:22 }}><span className="icon fa fa-arrow-left"></span>خرید محصول</Link>
  
                                  </div>
  
  
  
                              </div>
                              
                            </div>
  
                          </div>
  
                        )
                      })
                      }

                    </Swiper>
                  </div>

                </div>




              </div>
            }
            
            {
              this.state.catsList[0] &&
              <CatList _id={this.state.catsList[0]._id} UId={this.state.UId} ProductBase={this.state.ProductBase}  title={this.state.catsList[0].name} name={this.state.catsList[0].name} />

            }
            {
              this.state.shopList[0] &&
                 <ShopList _id={this.state.shopList[0]._id} name={this.state.shopList[0].name} ProductBase={this.state.ProductBase} style={{marginTop:30,marginBottom:30}} />
            }

            {this.state.Theme != "2" &&
              <div style={{marginTop:10,marginBottom:10}} >
              <Photos name="file6" className="InlineImages" borderRadius="30" padding="20" width="100%" height="180"  />
              </div>
            }
            
            {
              this.state.catsList[1] &&
              <CatList _id={this.state.catsList[1]._id} UId={this.state.UId} ProductBase={this.state.ProductBase}  title={this.state.catsList[1].name} name={this.state.catsList[1].name} />

            }
            {
              this.state.shopList[1] &&
                 <ShopList _id={this.state.shopList[1]._id} name={this.state.shopList[1].name} ProductBase={this.state.ProductBase} style={{marginTop:30,marginBottom:30}} />
            }
            {this.state.ProductBase && this.state.Theme != "2" &&
            <div className="row" style={{marginTop:10,marginBottom:10}} >
              <div className="col-md-6 col-12">
                <Photos name="file8" className="InlineImagesHalf"  />
              </div>
              <div className="col-md-6 col-12">
                <Photos name="file9" className="InlineImagesHalf"  />
              </div>
            </div>
            }
            
            {
              this.state.catsList[2] &&
              <CatList _id={this.state.catsList[2]._id} UId={this.state.UId} ProductBase={this.state.ProductBase}  title={this.state.catsList[2].name} name={this.state.catsList[2].name} />

            }
            {
              this.state.shopList[2] &&
                 <ShopList _id={this.state.shopList[2]._id} name={this.state.shopList[2].name} ProductBase={this.state.ProductBase} style={{marginTop:30,marginBottom:30}} />
            }
            {this.state.Theme != "2" &&
            <div style={{marginTop:10,marginBottom:10}} >

            <Photos name="file7" className="InlineImages" borderRadius="30" padding="20"  width="100%" height="180" />
            </div>
            }
            {
              this.state.catsList[3] &&
              <CatList _id={this.state.catsList[3]._id} UId={this.state.UId} ProductBase={this.state.ProductBase}  title={this.state.catsList[3].name} name={this.state.catsList[3].name} />

            }
            {
              this.state.shopList[4] &&
                 <ShopList _id={this.state.shopList[4]._id} name={this.state.shopList[4].name} ProductBase={this.state.ProductBase} style={{marginTop:30,marginBottom:30}} />
            }

             
            {
              this.state.shopList[3] &&
                 <ShopList _id={this.state.shopList[3]._id} ProductBase={this.state.ProductBase} name={this.state.shopList[3].name}  />
            }

            {this.state.Theme != "1" &&
            
              <div className="col-lg-12 col-12"  >
                  <div className="row" style={{ marginTop: 10 }}>

                    <div className="col-lg-12 col-12 TopSlider"  >   
                      <TopBox Theme={this.state.Theme} part="2" /> 
                    </div>
                  </div>
                </div>
            }

            {
            this.state.catsList[4] &&
              <CatList _id={this.state.catsList[4]._id} UId={this.state.UId} ProductBase={this.state.ProductBase}  title={this.state.catsList[4].name} name={this.state.catsList[4].name} />

            }
            {
             this.state.catsList[5] &&
              <CatList _id={this.state.catsList[5]._id} UId={this.state.UId} ProductBase={this.state.ProductBase}  title={this.state.catsList[5].name} name={this.state.catsList[5].name} />

            }
            {
            this.state.catsList[6] &&
              <CatList _id={this.state.catsList[6]._id} UId={this.state.UId} ProductBase={this.state.ProductBase}  title={this.state.catsList[6].name} name={this.state.catsList[6].name} />

            }
            {
            this.state.catsList[7] &&
              <CatList _id={this.state.catsList[7]._id} UId={this.state.UId} ProductBase={this.state.ProductBase}  title={this.state.catsList[7].name} name={this.state.catsList[7].name} />

            }

              

            


          </div>

        </div>

        :
        <div style={{ zIndex: 10000 }} >
          <p style={{ textAlign: 'center' }}>
            
            <img src={this.state.loading_pic}  />
          </p>

        </div>


    )
  }
}
const mapStateToProps = (state) => {
  return {
    CartNumber: state.CartNumber,
    off: state.off
  }
}
export default withRouter(
  connect(mapStateToProps)(MainBox2)
);
