package com.store.Controler;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class HomeControler {

    @RequestMapping("/")
    public String index() {
        return "index";
    }

    @RequestMapping("/myAccount")
    public String myAccount() {
        return "myAccount";
    }

    @RequestMapping("/login")
    public String login(Model model) {
        model.addAttribute("classActiveLogin",true);
        return "myAccount";
    }

    @RequestMapping("/newAccount")
    public String newAccount(Model model) {
        model.addAttribute("classActiveNewAccount",true);
        return "myAccount";
    }


}
