package com.springmastery.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class WebViewController {

    @RequestMapping(value = {
        "",
        "/dashboard",
        "/graph",
        "/topic/{slug}"
    })
    public String forward() {
        // Forward to Angular index.html to allow client-side routing
        return "forward:/index.html";
    }
}
