import React, { Component } from 'react';
import {BrowserRouter , Route,Link,Redirect} from 'react-router-dom'
   
class MainBox3 extends React.Component {
    constructor(){
        super(); 
        this.data="dssddsdss"
       // this.get();
    }

    state = {
        data : ""
    }
    get = () =>{
        const axios = require('axios');
        var that = this;
        // Make a request for a user with a given ID
        axios.get(/*'https://api.emdcctv.com/MainApi/getuser'*/'http://localhost:3000/MainApi/getuser')
        .then(function (response) {
            // handle success
            that.setState({data:response.data[0].name + " " + response.data[0].family})
            console.log(response.data[0].name + " " + response.data[0].family);
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .then(function () {
            // always executed
        });

    }
    render(){
        return (
         <div className="section light-bg" id="features" style={{marginTop:20,background:'linear-gradient(80deg, #efe3cd, transparent)'}}>


        <div className="container">

            <div className="section-title" style={{display:'none'}}>
                <small className="yekan">نام شرکت</small>
                <h3 className="yekan">توضیح کوتاه</h3>
            </div>


            <div className="row">
                <div className="col-12 col-lg-4">
                    <div className="card features" style={{textAlign:'right'}}>
                        <div className="card-body" style={{height:150}}>
                            <div className="media">
                                <span className="ti-face-smile gradient-fill ti-3x mr-3"></span>
                                <div className="media-body">
                                    <h4 className="card-title yekan" style={{textAlign:'center',margin:0}}>نرم افزارها</h4>
                                    <p className="card-text">

                                    
                                    <a href={'http://aniashop.ir/AniaShop_0_0_8.apk'} className="title yekan" style={{fontSize:18,float:'left'}}>
                                    <img src="https://www.amusabzi.com/Images/Master/android.png" style={{width:'100',height:100}}/>
                                     </a>
                                     </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-lg-4">
                    <div className="card features" style={{textAlign:'right'}}>
                        <div className="card-body" style={{height:150}}>
                            <div className="media">
                                <span className="ti-settings gradient-fill ti-3x mr-3"></span>
                                <div className="media-body">
                                    <h4 className="card-title yekan" style={{textAlign:'center'}}>توضیحات مربوط به شرکت</h4>
                                    <p className="card-text yekan">توضیحات مربوط به شرکت</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-lg-4">
                    <div className="card features" style={{textAlign:'right'}}>
                        <div className="card-body" style={{height:150}}>
                            <div className="media">
                                <span className="ti-lock gradient-fill ti-3x mr-3"></span>
                                <div className="media-body">
                                    <h4 className="card-title yekan" style={{textAlign:'center'}}>تماس با ما</h4>
                                    <p className="card-text yekan">
                                    توضیحات تماس شرکت
                                    <br/>
                                    توضیحات تماس شرکت
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>



    </div>
        )
    }
}
export default MainBox3;