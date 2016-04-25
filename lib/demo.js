function init() {
    demo = new Demo(document)
}

class Demo {
    constructor() {
        this.env
        this.agent
        this.vis

        Demo.initMenu(agents,"agent_select")
        Demo.initMenu(environments,"env_select")
        Demo.initMenu(configs,"conf_select")
    }
    run(doc) {
        var conf = configs[doc.getElementById("conf_select").value]
        this.env = new environments[doc.getElementById("env_select").value](conf)
        var options = new Options(doc,this.env)
        if (this.env.constructor.name == "SimpleDispenserGrid") {
            // TODO clean up
            options.prior_type = "Mu"
            options.midx = this.env.grid.M * this.env.grid.disp[0][0] + this.env.grid.disp[0][1]
            options.model_class = Options.makeModels(SimpleDispenserGrid,conf)
        }
        this.agent = new agents[doc.getElementById("agent_select").value](options)
        var hist = this.simulate(this.env,this.agent,options.t_max)
        this.vis = new Visualization(this.env,hist)
    }
    simulate(env,agent,t) {
        var trace = []
        var r_total = env.initial_percept.rew
        var s = env.initial_percept.obs
        var q = 0
        for (var iter = 0; iter < t; iter++) {
            var slice = {
                obs : s,
                reward : r_total,
                pos : env.pos, // TODO generalise to environments where state is not captured by env.pos
                q : q
            }
            var a = agent.selectAction(s)
            env.do(a)
            var percept = env.generatePercept()
            var s_ = percept.obs
            var r = percept.rew
            agent.update(s,a,r,s_)
            q = agent.Q.get(s, a)
            s = s_

            r_total += r
            trace.push(slice)
        }
        return trace
    }
    static initMenu(obj,str) {
        for (var o in obj) {
            var x = document.getElementById(str)
            var option = document.createElement("option")
            option.text = obj[o].name
            x.add(option)
        }
    }
}

class HeavenHell extends Demo {

}

class SquareShannon extends Demo {

}

class ShannonNoise extends Demo {

}

// etc