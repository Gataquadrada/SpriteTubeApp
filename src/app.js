const _VERSION = "1.1.2"
var _PORT = 3000

var _FRAMES = {}
var _FRAME_PROPS = {
  frameNumber: null,
  frameImg: null,
  isHidden: false,
  isFlipped: false,
}
var _FRAME_OLD_PROPS = {}

const _PARTYSERVER = "ws://caramel.gg:8880"
var _PARTYWSS = null
var _PARTY = {
  partyName: "",
  partyPassword: "",
  userName: "",
  memberEmail: "",
}

const _ICONS = {
  __null:
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
  none: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAH4AAAB+CAYAAADiI6WIAAAACXBIWXMAABYlAAAWJQFJUiTwAAAN30lEQVR4nO2dC2xT1xnHP+fhODjEwQlJgIQ360IChFEebcWggIu6LitVRbpJWwFNmiqVDZhUqaNjDUODTVMZ3dROajfx0JCmSFWDQtutgZFWa6EFSkwxgdKMhCSQkAd5x3nZ03d7jjl17cS+955zr33vX7Jyrx/H1/nd7zy+853vWPx+P5gynhJM5saUCd6gMsEbVCZ4g8oEb1CZ4A0qE7xBZYI3qEzwBpUJ3qAywRtUJniDygRvUJngDSoTvEFlgjeoTPAGlQneoDLBG1QmeIPKBG9QJRnxZ7tKStcGP1dVWV6tzdVoo7gNryZw8TGbPIoBwBHBR7sBoAYA6snfmni8KeIGvKukFMFuIo8lHL7iBABU4KOqsryLQ/lCFdPgXSWlaMlbyWNW8OuTkuBeth3uzZ8ynJjvGEqb6RjIxOenO/ogP7098L6eoTSovZslHTf1pA42dNnu1nZYbXf7wTHiA1uIrz5BboAjXH8gR8UkeFKN7wSAJ9nnbUnQ8a0pvoH1c7syV+bfmZSe0qf4uxp7suBMXa73/G17W10X5Ae93AAACP9QrNUCMQWeAC8DgDX0uaQEy8DCzLGOnyy9nV84tZnr92PNUPVl/uC/6tJ7mnshh3kJ+wVlVZXlh7hegIqKCfCkSj/EWjhW488U9vo2LriVqYZlRytP2ww47p7eWtOawN4AWANsjYXOoO7Bu0pKdxIrl3rkCPxHRT22pwtrU7W/uq+agoMfz22/3mHJYp4+QW4A3Vb/ugXvKinNIL1oqVpPtED/xrlDo9tX1UQyJBOuTxpnw8FzOX29w5BGvhutf1NVZXmNHq9Xl+BJW15BrTzXDs1719XNYHvietXrny4ZOnnDlsJc3i49tv26A+8qKcWh2WF6vrlg4N6273w+Rdurik5o/Qc+yh0aHvPTG+BoVWX5Vj1do67Au0pKsS1/GaTeOgwe2NCUyrunzks4AtjxbmFf60Cg6j+KQ1C9tPu6Ae8qKcXx8BY8dtqg/fXve7K06K2rrT2nl3debElwkmLd6EbWA3xdzM65SkoPUeiZqdAZL9BR+9afdz40Y2yYnC4hw1LNpbnFs206Qn/tCY8zXqCz2lf94PDZ5kQreUrzNl9Ti3eVlG6i0LF6j1foqD1rL1iX5fo6yekW4p/QTJpZPPHG4RjXgT72I5s8mnjgROv5d1b23ewKdPge1crLp6XFS+P0BIulb9+6JkNARx3Y4EmbbAX6YyuIo0q4NAFPhm3SnPmWxT1DsTpkkyO8wX+ztolavIPM7gmXcPAkYEIaqy9wQsvmoquZWvxwLYU3+g8X9nvJJTxJ+jpCpYXFS8MZnE7dt86Tq2bB/3AXXf/Fuyvd9V3ZqlUh6Ig5+NHShiOfLbqkVpmoZ5desc10AB3PHxFd5Qvt3LFDt21LejvUsvbTdQvgtQvODu8oBMpbluur3bf+fIGSct/yFAwecaf7xvxgx/PkBLizfXmnwzX/xiQ1rhundl94P4+e7q2qLC9To9xIJNripR+WPQka1IJecfXb8Mo5JxDo3WRWDC62JBS88O8VdXLLReh/r0lPJdCx3O4RH0z70yfOSfiaGteOVf7amSO95PRlMtIRImHgibVLcXE/W9aaNfEnJhZCf+NSYJa2m7hDZxO/OHjaLfPkwKfQyambidLFY8DX1IL/3IovJlsTLUPkNC4tPmDtD8+stystLAx0ae6beMVkwQ8BXfKtV1WW15NwbVXhYy//sbmBYraIauuFgCfz66pZ+3jQqeTADwedKbOLB/wfL6lj5++FePREWbzkl0YPnVJrjwQ6VTTwJ4LOlKk6fLT6FdPGqFNHiA+fO3hSdUkzb4/PGxya+BPhFQ10qkjgRwqdKVN1+JsX3aFOnVmhlnipLREWH3BOPLPof9PlFoJDn2ihU40HH4eC0UBnyvwG/KovFwzI/X3Yw2dcudytXhj4rFRLnRJ//J/P5bEBdxFDpwqGf/izRffwZnr1Uye11O5ogyQY+NIQ8q8XnYqsfs0sbzI55O7JEwFeqrZWzxxQFA7d2AOBTqHcyFUCH0Of4a1r9uTdp/K8oz5IlQOdKbOLLLAE1oEkR2vmtNNOnoO4trmJK3hy8VL9/PCsDtnVPIpxb4LCfwr2mht8fn8aWRfXrSQMmlyLdD0Y86/guqTq3p5s6SanXNt53hYvXTzGxCudgfv5yqaM5ASgExvVcuHjeJw4ebZh6DM6Z+TOiZNrqKbTy2WPNiVH8LFxlZfuGyGvcwXPOzGCBCczFbB9VjSMwxtn/waw/epU3uCoT6pFEH7UbT2V0pWuwdB/v6ERirKb0yL46Lh6cNpA1vUO6V8V0xYv+Z4XZo14J37rxEL4GHKNodekCZFt+UrECzpqvjPQAXbw9OLxBi8tf1o4tT9l4rdGJq3h84SOKsj+2mohbr+LG3j2bp1qH1J11kkr+LyhA/HiMeI2W8fT4gMggu5iVSQavgjoVDiRRQ5jEnxAvAIpRcEnLlQh0FG25IiSNClSzOe54w2fxMOdEQVdlOIiwWEI+Gq6PKVhHzpn/uBqTBMBPW/yWD855Daki5vMlgh/YaaPh19C8hjOyfB3igoDn5Q0Nsr7O+IGPK5Nu9yWQD1naq5GlSweJ3Z2n1reqmK5YdXYm0ydXfW8viMuwActSPxAzQwUJPJVmtXDREe47FmtssNpcNRCay4TfDgFQXfzmNJkp3RxrTtv+GM+UBSwEol4gg9Ut5gZiodCQOeWdEAk/P4RC6+iA+IGnp08aexK6x//3dFLJHQqUfC7vH6aO4/bSlreVb00t3y5xdGiZqFaQKfiDT+oduT2m3iDl6z+Vre1d+K3RiYtoVPxhP9F2/0EXzxz5AkB39SbOFmNwvQAnYoX/No2O43AcatRXjjxBi+1Ue2D/nlKCzp2qcirFnRco4ZZtlwlpRVKQpmD4b96tljxOP/zthQagcM1I6YQi0cpCT1GnbxhH2FOlUBHP34NifXHpMhnyLo+WSLwJes8XW9TXLMxQaVcU6RwBU/Wm0lTjB82ZDRM/InwGvZZqLWDQuiBWTZMuEReOqwEPu2Ejfr8ipZPY4w/o9gFT4S5bsDTnpCtpJDi7NGAxcuBFGo+HfPpYYo18hZZ8MlnpEijxVN9jdF+nlV1fQa9FjcxGm4SAV7ydWPM+ZW7M2RPzP/ykWtpU1OBdnyigsRCx3M6tYpxAphiTS58NtHDZCs07l5TG7yDRVS6fDeB1hjc8+JwB0+GJFI1f/TSDNmdH4T0lyc8jlw70NUqEUEKhv7T4p5BdmpVLvxg6G/+wJOvJOAE1wUy+99UyC4oQony1Ut38LUOSy7mlJEr/MceetyTGin8UNBDbXAQLXy1oaPeq3PQ/sYJ3tU8iAaPaUX+dmGBok5epPAjhc6W++LqJqc10ULzzoYrV3XomOac6c0LSX8mBDy5g6XxbvUta7YSq4cI4EcLnQoDLX63vtEaDj4P6NKXuHPoKKWhqrKcezUPIrNekcQ+N/F449yh1h0P1eRM/KnxhTfQzvcKB1v6gUJ9lVhM1NBZ4Sral07nDw+P+ekQEpdaZdD8fGpCR2vf+2HgX7FN1F52otOdSTnpcS3d8ac9djX+cSHgByQHOlUI+JLUhI567uTKrlvd0k3VQNb0CZEm6c6wrd//QYGiMS8VrfbnZASSCkjJE3et7BxQslMVVvvHnrpipWNzC0DP6vxRt5rQj7uLgEAHUblvqIRnr2a3H/n16tZ+NTJgUaGV9nmTpQUcasby41SpI8WraplYUz37dhHdtwbDxbinP2GlSdpyV0kpdvZmGSldebCY9OXolCoWMYRjpVXMnRQXh968Pf8pVDVIIxaEM41Mzvoy0dBBK/DEm7cXj290Qu6bFxbf1uI6tBD24v951U49dCe02pNOsyhbErYs5aN5+3rqdLVShOpZ2AfB/ejIJTaIymkXSlqHVwfmsg+7HWNKJnH0LuzM/bY6r4905mjeHc22IdMUPPnh2N53YzKiF0/lQzzCR+jPv1PYyew7q/mes5ovqGCSAwfgf3xrturh2FoJq3eE3jEIdNPBbXrYZlxPO03K8q/rWcT7x+4xK8wlO5H0trdsMfG1SxsVFef4WvdvOK/Yp6+FsLN69HI6MAkUd+oFOuh0N+mv7RufYbO0vvTdxpxY2akK2/M//reA3U82qry7oqTL/ePh/n6zO+j59+YNdW9fVcM9RYgS4Rj9lbM5vX0jQKNtdbOJcLB0Cx7u556poO0+pvvctaolSU3/vhpCX/4b5+ewVg6iNxeKVroGD/er/jLW+jErFO50ofUNgNX6sUvzu9+/mWIlbTlQx4weeu7jSffgqYj1l9G2H0j7/9QDPUkbF9wSOtETxsKxLT+kZytnFTPgqULdADj//oDTd+exefemqbUnXLAQ9pm6XG/VTfsAMyYHCpxA111bHk4xB56K3ABb6bYnrHLt0Fw0dXj0kZn3Zsmdm0fQuHL1bJOj+Vp7YkqnF4KzOzSQoWdMAaeKWfBUpA+wlTyWhHoP1ghOm78Njxdn0zjKb6q2w2obGQPv3YGvdswKI5xYOiIqKJKXYh48K3ITbCIu4OJwN0KUchOPYnWsw2YVV+BDiTQJs8kjY4KM0PXsQ+89cyWKe/CmQituEhyaik4meIPKBG9QmeANKhO8QWWCN6hM8AaVCd6gMsEbVCZ4g8oEb1CZ4A0qE7xBZYI3qEzwBpUJ3qAywRtUJniDygRvUJngDSoTvBEFAP8Hh6XcxFfghFwAAAAASUVORK5CYII=",
  hide: "data:image/png;base64,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",
  show: "data:image/png;base64,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",
  first:
    "data:image/png;base64,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",
  last: "data:image/png;base64,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",
  random:
    "data:image/png;base64,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",
  toggleflip:
    "data:image/png;base64,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",
  flip: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAH4AAAB+CAYAAADiI6WIAAAACXBIWXMAABYlAAAWJQFJUiTwAAAER0lEQVR4nO3dz0sUYQDG8Wc2NXE3DXQzyjCiLlEUHYpCsMCgQ1IU2K0i6B/o0kEiozp0q38gslsLRbF0aiGD6lhiEUQQWGFQWqZl4JYTI7sm9sN51xl533me70HW2Hde9OPMtLvv7Hq+70PxlZI5Z4InTfCkCZ40wZMmeNIET5rgSRM8aYInTfCkCZ40wZMmeNIET5rgSRM8aYInTfCkCZ40wZMmeNIET5rgSRM8aYInTfCkCZ40wZMmeNIET5rgSRM8aYInTfCkVdn4Y3d0di0H0APgIIDWmKcbBHC5kM9djnkeq7LyzY86Orv6ALRXOr4xk0JTev6D2dvPPzExOfPz9xbyueOVzulatsL7ddU+rux7jZb6YaOxS5pWwFvWEPr+Nx834fpDv/wHQINv6zl+cKLoYWg8bTzw5/AH+ONfQt//8K5hXDxSRF2NF3x7rKOz65rxpA5mK/z0+fbSo2a8+LjKeLAp/qbWMTp8a9/gsPTLPxYc8s/veYeN2SHjbZge9p8P1qP7RjXFYd/ah3OlX3pvcMg/c78Fr0dXGm9De/6/s/px/Gz80/daMenFf85nwbf+CZwy/tdJ4MStzcKPKCeeuSvjj0z4wo8oZ56yFX60OfVcvfCjy7kXaYQfTU6+Oif8hefsy7LCX1hOvx4v/MpzfiGG8CsrEStwhG9eYpZeCd+sRK25E374ErfYUvjhSuQqW+HPX2KXVwv//yV6Xb0l+D3Gky5CFJ8tW17G1Vjn4eqhZ6jxvxlvo2r1GqCmNvT95yzj2lPI5/qMJ40xiitpotjzp76MGt0/2POPtnnlb61bu0dzCVUJ/06Af6Fvk/kGfhSNh+zdMla+udZ8wnijge/o7NoKYHdwe/9Gs713utQS4yFvhsOfGhY7CvgSenCObTi54zu2Z18ab8PL1BuP6X0wA3/beHDMJR5+Lvqh9QPG20hllsFLZ4zG9NxoRv+bHyhdlGndw7pEw0eFnsqarekP0B+9mv4/QfA48GAhn6vg3BJviYW3BH13IZ/rN554EUokvNDnL3HwQg9XouCFHr7EwAvdrETAC9085+GFXllOwwu98pyFF/rCchJe6AvPOXihR5NT8EKPLmfghR5tTsALPfqshxd6PFkNPxt977qi0CPMWvjZ6G0tRZza+cR4G0L/d1bCz0Xvbhd61Nm6x/cIPd5shT8QfBF6fFn50STlLj7Yhmx6eqUq0kt9bFg5iebMNzTW/v0SqNGpBrwfyQIj4bY/9KkKd596ePuZCx0Ww58DcPbhu2oA1b//daAOwPIIp5kq36BCh+XvV7+19GFEcRcsfb5m4xLoOKO4Wlb9mT53jjTBkyZ40gRPmuBJEzxpgidN8KQJnjTBkyZ40gRPmuBJEzxpgidN8KQJnjTBkyZ40gRPmuBJEzxpgidN8KQJnjTBkyZ40gRPmuBJEzxpgidN8KQJnjTBkyZ4xgD8Asu9JxClVX5uAAAAAElFTkSuQmCC",
  unflip:
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAH4AAAB+CAYAAADiI6WIAAAACXBIWXMAABYlAAAWJQFJUiTwAAAET0lEQVR4nO3dyWsTUQDH8V+WRm2pbREVRa0e1CqodTmICC7k4CUoCjlXTz36H+ileNVbQVDPPYjSk1BwwYsHN8QFUXGpFEtFo22w6RKZmCkFBTPJTOa99/t9Tx3KdJJ8MmnSvvcmUS6XofhKypwzwZMmeNIET5rgSRM8aYInTfCkCZ40wZMmeNIET5rgSRM8aYInTfCkCZ40wZMmeNIET5rgSRM8aYInTfCkCZ40wZMmeNIET5rgSRM8aYInTfCkCZ40wZMmeNLSbHc7m8v3ArgI4FDEhyoAuAPg/Mjw0JOIjxU4qsWPsrl8H4Cr/vbW1f9/3hdLZXz6NtfIYb0nQO/I8ND7Rn5I2NGc8YvRT+xNI7dvEhtWFmvbeX4ec2OfUC6Vaj7ez1IrLtzbjsdfUh0ANgIQfLNbjN5/NIlTB8ZrvwV1oHu1Z4r4+DPlb3437TFx/s3d3+gTte9cJ7rXwN09+PrnBeWuib/jnYaPE/3+aIv35VPvN0vgH9CEnH1zl83lDwO4jXjRD48MDxn3Mg9Xz/jqR7YbaDL64MPdVqDDRfgquvf5uaOZ6Nff7MTNVxnYgA7X4ONEv/xgGWxBh0vwQg+WE/BCD5718EKvL6vhhV5/1sILvbGshBd641kHL/Rwsgpe6OFlDbzQw80KeKGHn/HwQo8mo+GFHl3Gwgs92oyEF3r0mXrG36gLHRB6jRkHn83lvTFq3d6Y96Do5alJodeYiWe89zKPbevq2LM0HXiX54VNPvoHFnQYCl954IvTieB7poNPE9jcOY4VrZVjdZs6IjaKTISvDJK8/3oWP6YygXZMtLUjkQz2hMmUp3Dl5DMf/2p1SLbzGQdfnWN2yZuzdvZaRzD8ZBKpNeuEX0PGjqvP5vLe7JNd67tSuNhXwPK2AG/aSr8wNzaK8nyw+1ZKtOHM9R34Wqzsd3pkeOha4BtuSSb/5c6bEPHUm6ka+MzPLNWZ/5+Mha++uxZ+RBn9t3rhR5fx/50TfjRZ8f944YefNSNwhB9uVo25E354WTfKVvjhZOW4euE3nrUzaYTfWFbPnRN+/Vk/W1b49eXE/HjhB8+ZFTHixB84NupvWoPv1Bo4ceF3LxvF4MnP/qYV+M6tehUn/rkjC4NDjcd3cp27uPD3r32L/j0Ff9NofGeXNI0L//i2V1bgO79efTaX76zOymnqMK6bL3sw+KjD3+wybdi286tXx3nm7169cIED44Zt01yhYvGZ35pJ4OCWNA721D4BY0liBt0tn5HC7D+//2JiFca+p/GlsLBGPW69W4riTOUJY9zATbZLk3RWx+1HfT2axRk5LYsK3q86P6+3CYd6b+oQbUp4pevO0SZ40gRPmuBJEzxpgidN8KQJnjTBkyZ40gRPmuBJEzxpgidN8KQJnjTBkyZ40gRPmuBJEzxpgidN8KQJnjTBkyZ40gRPmuBJEzxpgidN8KQJnjTBkyZ40gTPGIDf9dh/Q+0vKtQAAAAASUVORK5CYII=",
}

const express = require("express")
const es6Renderer = require("express-es6-template-engine")
const app = express()
const http = require("http")
const server = http.createServer(app)
const WebSocket = require("ws")
const fs = require("fs")
const bodyParser = require("body-parser")
const path = require("path")
const { Canvas, loadImage } = require("skia-canvas")
const { captureRejections } = require("events")

/* 
 ! INIT
 */

try {
  if (!fs.existsSync(path.join(__dirname, "config"))) {
    fs.mkdirSync(path.join(__dirname, "config"))
  }

  if (!fs.existsSync(path.join(__dirname, "config", "port.txt"))) {
    fs.writeFile(
      path.join(__dirname, "config", "port.txt"),
      "3000",
      (err) => {}
    )
  }

  const port = fs.readFileSync(
    path.join(__dirname, "config", "port.txt"),
    "utf8"
  )
  _PORT = port
} catch (err) {
  console.error(err)
}

try {
  if (!fs.existsSync(path.join(__dirname, "config", "party.json"))) {
    fs.writeFile(
      path.join(__dirname, "config", "party.json"),
      JSON.stringify(_PARTY),
      (err) => {}
    )
  }

  const party = JSON.parse(
    fs.readFileSync(path.join(__dirname, "config", "party.json"), "utf8")
  )

  _PARTY = { ..._PARTY, ...party }
} catch (err) {
  console.error(err)
}

try {
  if (!fs.existsSync(path.join(__dirname, "character"))) {
    fs.mkdirSync(path.join(__dirname, "character"))
  }

  if (!fs.existsSync(path.join(__dirname, "character", `character.png`))) {
    fs.copyFile(
      path.join(__dirname, "assets", "character-demo.png"),
      path.join(__dirname, "character", `character.png`),
      (err) => {}
    )
  }

  if (!fs.existsSync(path.join(__dirname, "character", `character.json`))) {
    fs.copyFile(
      path.join(__dirname, "assets", "frames-demo.json"),
      path.join(__dirname, "character", `character.json`),
      (err) => {}
    )
  }
} catch (err) {
  console.error(err)
}

try {
  _FRAMES =
    JSON.parse(
      fs.readFileSync(
        path.join(__dirname, "character", `character.json`),
        "utf8"
      )
    ).frames || []
} catch (err) {
  console.error(err)
}

/*
 * LOCAL WSS SERVER
 */
const wss = new WebSocket.Server({
  server,
})

const renderFrame = async (frameNumber, temp = false) => {
  if (frameNumber !== _FRAME_PROPS.frameNumber) {
    _FRAME_PROPS.isHidden = false
  }

  if (_FRAME_PROPS.isHidden || !Object.keys(_FRAMES).length) {
    return _ICONS.__null
  }

  var frame = null

  if (temp) {
    frame = _FRAMES[frameNumber]
  } else {
    switch (frameNumber) {
      case "none":
      case "hide":
        _FRAME_PROPS.isHidden = true
        return _ICONS.__null
        break

      case "show":
        if (_FRAME_PROPS.frameImg) {
          return _FRAME_PROPS.frameImg
        } else {
          _FRAME_PROPS.frameNumber = Object.keys(_FRAMES)[0]
          frame = _FRAMES[_FRAME_PROPS.frameNumber]
        }
        break

      case "first":
        _FRAME_PROPS.frameNumber = Object.keys(_FRAMES)[0]
        frame = _FRAMES[_FRAME_PROPS.frameNumber]
        break

      case "last":
        _FRAME_PROPS.frameNumber =
          Object.keys(_FRAMES)[Object.keys(_FRAMES).length - 1]
        frame = _FRAMES[_FRAME_PROPS.frameNumber]
        break

      case "random":
        _FRAME_PROPS.frameNumber =
          Object.keys(_FRAMES)[
            Math.floor(Math.random() * Object.keys(_FRAMES).length)
          ]
        frame = _FRAMES[_FRAME_PROPS.frameNumber]
        break

      case "flip":
        frame = _FRAMES[_FRAME_PROPS.frameNumber]
        _FRAME_PROPS.isFlipped = true
        break

      case "unflip":
        frame = _FRAMES[_FRAME_PROPS.frameNumber]
        _FRAME_PROPS.isFlipped = false
        break

      case "toggleflip":
        frame = _FRAMES[_FRAME_PROPS.frameNumber]

        if (_FRAME_PROPS.isFlipped) {
          _FRAME_PROPS.isFlipped = false
        } else {
          _FRAME_PROPS.isFlipped = true
        }
        break

      default:
        _FRAME_PROPS.frameNumber = _FRAMES[frameNumber]
          ? frameNumber
          : Object.keys(_FRAMES)[frameNumber]
          ? Object.keys(_FRAMES)[frameNumber]
          : Object.keys(_FRAMES)[0]
        frame =
          _FRAMES[_FRAME_PROPS.frameNumber] ||
          _FRAMES[Object.keys(_FRAMES)[_FRAME_PROPS.frameNumber]]
    }

    if (
      _FRAME_PROPS.frameImg &&
      JSON.stringify(_FRAME_PROPS) === JSON.stringify(_FRAME_OLD_PROPS)
    ) {
      return _FRAME_PROPS.frameImg
    }

    _FRAME_OLD_PROPS = Object.assign({}, _FRAME_PROPS)
  }

  const canvas = new Canvas(parseInt(frame.w), parseInt(frame.h))
  const context = canvas.getContext("2d")

  let image = await loadImage(
    path.join(__dirname, "character", "character.png")
  )

  if (!temp) {
    if (_FRAME_PROPS.isFlipped) {
      context.scale(-1, 1)
    }
  }

  context.drawImage(
    image,
    parseInt(frame.p.split(" ")[0]) -
      (!temp && _FRAME_PROPS.isFlipped ? canvas.width : 0),
    parseInt(frame.p.split(" ")[1])
  )

  const buffer = await canvas.toDataURL("png")

  if (temp) {
    return buffer
  }

  _FRAME_PROPS.frameImg = buffer

  return _FRAME_PROPS.frameImg
}

wss.on("connection", (ws, req) => {
  if (!_PARTYWSS || 1 !== _PARTYWSS.readyState) {
    ws.send(
      JSON.stringify({
        event: `partyError`,
        payload: `<i class="fa-solid fa-fan fa-spin fa-spin-reverse"></i> Connecting to party server...`,
      })
    )
  } else {
    partySend("partyGetMembers", {
      partyName: _PARTY.partyName,
    })
  }

  ws.on("message", (data) => {
    data = data.toString()
    data = data.startsWith("{")
      ? JSON.parse(data)
      : { event: "currentFrame", payload: data }

    data.event = data.event || "setFrame"
    data.payload =
      "currentFrame" == data.event
        ? _FRAME_PROPS.frameNumber
        : data?.payload
        ? data.payload
        : 0

    // console.log(`${new Date()} Message: ${data.event}`)

    switch (data.event) {
      case "setFrame":
        renderFrame(data.payload).then((b64Image) => {
          wss.broadcast({
            event: "getFrameImg",
            payload: b64Image,
          })

          partySend("partySetMemberImg", {
            partyName: _PARTY.partyName,
            userName: _PARTY.userName,
            frameImg: b64Image,
          })
        })
        break

      case "getFrameImg":
      case "getCurrentFrameImg":
        var frame =
          "getCurrentFrameImg" == data.event
            ? _FRAME_PROPS.frameNumber
            : data.payload || _FRAME_PROPS.frameNumber || 0

        renderFrame(frame).then((b64Image) => {
          ws.send(
            JSON.stringify({
              event: "getFrameImg",
              payload: b64Image,
            })
          )
        })
        break

      case "getFramesList":
        ws.send(
          JSON.stringify({
            event: "getFramesList",
            payload: _FRAMES,
          })
        )
        break

      case "getIcon":
        if (_ICONS[data.payload]) {
          ws.send(
            JSON.stringify({
              event: "getIcon",
              payload: _ICONS[data.payload],
            })
          )
        } else {
          renderFrame(data.payload, true).then((b64Image) => {
            ws.send(
              JSON.stringify({
                event: "getIcon",
                payload: b64Image,
              })
            )
          })
        }
        break

      case "playerReload":
        wss.broadcast({
          event: "playerReload",
        })
        break

      /* 
      ! PARTY STUFF
      */
      case "partyReboot":
        partyJoin()
        break

      case "partyGetStatus":
        if (_PARTYWSS) {
          ws.send(
            JSON.stringify({
              event: "partyGetStatus",
              payload: 200,
            })
          )
        } else {
          ws.send(
            JSON.stringify({
              event: "partyGetStatus",
              payload: 404,
            })
          )
        }
        break

      case "partyJoined":
        wss.broadcast({
          event: "partyJoined",
        })
        break

      case "partyGetMembers":
        partySend("partyGetMembers", {
          partyName: _PARTY.partyName,
        })
        break

      case "partyGetMemberImg":
        partySend("partyGetMemberImg", {
          partyName: data.payload.partyName,
          userName: data.payload.userName,
          remoteName: data.payload.remoteName,
        })
        break

      default:
        break
    }
  })

  ws.on("error", (error) => {
    // console.error(`onError: ${error.message}`)
  })
})

wss.broadcast = function broadcast(msg = {}) {
  msg = JSON.stringify(msg)
  wss.clients.forEach(function each(client) {
    try {
      client.send(msg)
    } catch (e) {}
  })
}

/*
 * PARTY SERVER
 */
var partyJoinTimer = null
function partyJoin() {
  _PARTYWSS = new WebSocket(_PARTYSERVER)

  _PARTYWSS.on("open", function () {
    try {
      clearTimeout(partyJoinTimer)
    } catch (e) {}

    wss.broadcast({
      event: `partyConnected`,
    })

    partySend("partyJoin", {
      memberEmail: _PARTY.memberEmail,
      partyName: _PARTY.partyName,
      partyPassword: _PARTY.partyPassword,
      userName: _PARTY.userName,
      frameImg: _FRAME_PROPS.frameImg,
    })
  })

  _PARTYWSS.on("message", function (data) {
    const { event, payload } = JSON.parse(data)

    switch (event) {
      case "partyJoined":
        wss.broadcast({
          event: `partyJoined`,
        })
        wss.broadcast({
          event: `TEST`,
        })
        break

      case "partyGetMembers":
        wss.broadcast({ event: "partyGetMembers", payload: payload })
        break

      case "partyGetMemberImg":
        wss.broadcast({
          event: `partyGetMemberImg-${payload.remoteName}`,
          payload: payload.frameImg,
        })
        break

      case "partyError":
        wss.broadcast({
          event: `partyError`,
          payload: `<i class="fa-solid fa-circle-exclamation"></i> ${payload}`,
        })
        _PARTYWSS.close()
        break
    }
  })

  _PARTYWSS.on("close", function () {
    wss.broadcast({
      event: `partyError`,
      payload: `<i class="fa-solid fa-fan fa-spin fa-spin-reverse"></i> Reconnecting to party server...`,
    })

    partyJoinTimer = setTimeout(() => {
      partyJoin()
    }, 60000)
  })

  _PARTYWSS.on("error", function () {
    _PARTYWSS.close()
  })
}

function partySend(event = null, payload = {}) {
  if (_PARTYWSS && 1 == _PARTYWSS.readyState) {
    _PARTYWSS.send(
      JSON.stringify({
        event: event,
        payload: payload,
      })
    )
  }
}

renderFrame(0).then((b64Image) => {
  if (
    _PARTY.memberEmail &&
    _PARTY.partyName &&
    _PARTY.partyPassword &&
    _PARTY.userName
  ) {
    wss.broadcast({
      event: `partyError`,
      payload: `<i class="fa-solid fa-fan fa-spin fa-spin-reverse"></i> Connecting to party server...`,
    })

    partyJoin()
  }
})

/*
 * LOCAL WEBSERVER
 */
app.engine("html", es6Renderer)
app.set("views", "views")
app.set("view engine", "html")

app.use(bodyParser.json({ limit: "50mb" }))
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/character", express.static("character"))
app.use("/assets", express.static("assets"))
app.use("/resources", express.static("resources"))
app.use("/img", express.static(path.join("resources", "img")))

app.get("/character.json", (req, res) => {
  res.sendFile(path.join(__dirname, "character", "character.json"))
})

app.get("/character.png", (req, res) => {
  res.sendFile(path.join(__dirname, "character", "character.png"))
})

app.get("/party-player/:remotename", (req, res) => {
  res.render(path.join(__dirname, "views", `party-player.html`), {
    locals: {
      port: _PORT,
      party: {
        partyName: _PARTY.partyName,
        userName: _PARTY.userName,
        remoteName: req.params.remotename.toString().toLowerCase(),
      },
    },
  })
})

app.get(["/", "/player.html"], (req, res) => {
  res.render(path.join(__dirname, "views", `player.html`), {
    locals: {
      port: _PORT,
    },
  })
})

app.get("/editor.html", (req, res) => {
  res.render(path.join(__dirname, "views", `editor.html`), {
    locals: {
      port: _PORT,
      party: _PARTY,
    },
  })
})

/* 
change __dirname + "/
for "./
change __dirname + `/
for `./
*/
app.post("/config.save", (req, res) => {
  var reboot = false,
    partyUpdate = false

  if (req.body.memberEmail && _PARTY.memberEmail !== req.body.memberEmail) {
    partyUpdate = true
    _PARTY.memberEmail = req.body.memberEmail
  }

  if (req.body.partyName && _PARTY.partyName !== req.body.partyName) {
    partyUpdate = true
    _PARTY.partyName = req.body.partyName
  }

  if (
    req.body.partyPassword &&
    _PARTY.partyPassword !== req.body.partyPassword
  ) {
    partyUpdate = true
    _PARTY.partyPassword = req.body.partyPassword
  }

  if (req.body.partyUsername && _PARTY.userName !== req.body.partyUsername) {
    partyUpdate = true
    _PARTY.userName = req.body.partyUsername
  }

  if (partyUpdate) {
    reboot = true
    fs.writeFile(
      path.join(__dirname, "config", "party.json"),
      JSON.stringify(_PARTY),
      (err) => {}
    )
  }

  if (req.body.port && parseInt(_PORT) !== parseInt(req.body.port)) {
    reboot = true
    _PORT = req.body.port
    fs.writeFile(path.join(__dirname, "config", "port.txt"), _PORT, (err) => {})
  }

  if (reboot) {
    res.json({ ok: true })
    wss.broadcast({
      event: "playerReload",
    })
    serverStart(_PORT)
    return true
  }

  res.json({ ok: true })
})

app.post("/editor.save", (req, res) => {
  try {
    if (!fs.existsSync(path.join(__dirname, "backups"))) {
      fs.mkdirSync(path.join(__dirname, "backups"))
    }

    var d = new Date()
    const date = `${d.getFullYear()}_${("0" + (d.getMonth() + 1)).slice(-2)}_${(
      "0" + d.getDate()
    ).slice(-2)}`

    if (
      !fs.existsSync(path.join(__dirname, "backups", `${date}-character.json`))
    ) {
      fs.copyFile(
        path.join(__dirname, "character", "character.json"),
        path.join(__dirname, "backups", `${date}-character.json`),
        (err) => {}
      )

      fs.copyFile(
        path.join(__dirname, "character", "character.png"),
        path.join(__dirname, "backups", `${date}-character.png`),
        (err) => {}
      )
    }
  } catch (err) {
    console.error(err)
  }

  if (req.body.spritesheet) {
    const spritesheet = req.body.spritesheet.replace(
      /^data:image\/png;base64,/,
      ""
    )

    fs.writeFile(
      path.join(__dirname, "character", "character.png"),
      spritesheet,
      "base64",
      function (err) {
        if (err) {
          console.error(err)
          return
        }
      }
    )
  }

  if (req.body.frames) {
    _FRAMES = req.body.frames

    fs.writeFile(
      path.join(__dirname, "character", "character.json"),
      JSON.stringify({ frames: _FRAMES }),
      (err) => {
        if (err) {
          console.error(err)
          return
        }
      }
    )
  }

  _FRAME_PROPS.frameNumber = null

  renderFrame(0)

  wss.broadcast({
    event: "playerReload",
  })

  res.json({ ok: true })
})

function serverStart(port) {
  try {
    server.close()
  } catch (err) {}

  server.listen(port, () => {
    console.log(
      `\x1b[36mMazeakin\x1b[0m's \x1b[34mSpriteTube\x1b[0m \x1b[31mv${_VERSION}\x1b[0m is running via http://127.0.0.1:${port}`
    )
    console.log(
      `\x1b[33mSupport me via https://www.buymeacoffee.com/mazeakin\x1b[0m`
    )
  })
}

serverStart(_PORT)
